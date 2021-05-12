import React, { useEffect, useState, useContext } from "react";
import { BookingContext } from "./../../../store/BookingStore";
import locationData from "../../../mocks/location-data.json";
import Map from "./Map";
import Loader from "../../../common/Loader";

import layout from "../../../styles/layout.module.scss";
import elements from "../../../styles/elements.module.scss";

const BookPlace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState();
  const [locations, setLocations] = useState([]);
  const [status, setStatus] = useState("");
  const [state, dispatch] = useContext(BookingContext);
  const apptLoc = state.bookingData.apptLoc;

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        setStatus("Getting your position...");
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
      } else {
        setStatus("Geolocation is not supported by this browser.");
      }
    };

    const locationError = (error) => {
      console.log(error.message);
      setStatus("Location access denied.");
      setLocations(locationData);
      setIsLoading(false);
      
      // if no location in global store yet, save the first from the dropdown list as default
      if (!apptLoc.name) {
        dispatch({
          type: "SAVE_BOOKING_DATA",
          payload: {
            ...state.bookingData,
            "apptLoc": locationData[0]
          }
        });
      }
    };

    const locationSuccess = (position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      setStatus("Updated user location.");
      sortShops(position.coords.latitude, position.coords.longitude);
      setIsLoading(false);
    };
    
    // TODO: change for the Google Maps function to count the distance? ///////
    function getDistanceInKm(lat1, lon1, lat2, lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1);  // deg2rad below
      var dLon = deg2rad(lon2 - lon1); 
      var a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ; 
  
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
      var d = R * c; // Distance in km
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    const sortShops = (userLat, userLng) => {
      // calculate distance from user and save it into the copy of locations array
      const locationsToSort = [...locationData];
      locationsToSort.map((loc) => {
        const distance = getDistanceInKm(userLat, userLng, loc.pos.lat, loc.pos.lng);
        loc.distanceInKm = distance.toFixed(3);
        //console.log(loc);
      });
  
      // sort the location array by loc.distance
      //const sortedList = [...locations].sort((a, b) => a.distanceInKm - b.distanceInKm);
      const sortedList = locationsToSort.sort((a, b) => a.distanceInKm - b.distanceInKm);
      //console.log("sortedList", sortedList);
  
      // save the sorted list as locations, so the dropdown list updates
      setLocations(sortedList);
      
      // if no location in global store yet, save the first from the dropdown list as default
      if (!apptLoc.name) {
        dispatch({
          type: "SAVE_BOOKING_DATA",
          payload: {
            ...state.bookingData,
            "apptLoc": sortedList[0]
          }
        });
      }
    };
      ///////////////////////////
  
    getLocation();
  }, []);
  
  console.log("Status: ", status);

  const handleLocInputChange = (e) => {
    const shop = locationData.find((item) => item.name === e.target.value);
    //console.log("shop: ", shop);
    dispatch({
      type: "SAVE_BOOKING_DATA",
      payload: {
        ...state.bookingData,
        "apptLoc": shop
      }
    });
  };

  if (isLoading) return (
    <Loader 
      primaryText="Trying to get your location, please wait"
      secondaryText="You might need to allow or disallow the location access also in your device's system settings." />
  );

  return (
    <>
      <Map userLocation={userLocation} />
      <div className={layout.pGeneralX}>
        <label htmlFor="apptLoc">
          <h1 className={elements.title}>Choose location from the map or list</h1>
        </label>
        <div className={layout.flexCenter}>
          <select 
            className={elements.input}
            name="apptLoc" 
            id="apptLoc" 
            value={apptLoc.name} 
            onChange={handleLocInputChange}>
            {locations.length > 0 ? 
              locations.map((shop) => (
                <option key={shop.name}>{shop.name}</option>
              ))
              : null}
          </select>
        </div>
      </div>
    </>
  );
};

export default BookPlace;