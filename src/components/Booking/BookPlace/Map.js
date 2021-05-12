import React, { Fragment, useContext, useState } from "react";
import { BookingContext } from "../../../store/BookingStore";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import PropTypes from "prop-types";
import config from "../../../config/config";
import locationData from "../../../mocks/location-data.json";

import carMarker from "./../../../assets/sports-car.svg";
import userMarker from "./../../../assets/user-pin.svg";


//default container size for the map
const mapStyles = {        
  height: "50vh",
  width: "100%"
};
//default center for the map
const defaultCenter = {
  lat: 60.192059, lng: 24.945831
};

const Map = ({userLocation}) => {
  const [state, dispatch] = useContext(BookingContext);
  const apptLoc = state.bookingData.apptLoc;
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const [zoom, setZoom] = useState(10);
  // const [center, setCenter] = useState(defaultCenter);

  // Load the Google maps scripts
  const { isLoaded, loadError } = useLoadScript({
    // Enter your own Google Maps API key
    googleMapsApiKey: config.apiKey
  });

  //Sets the viewport to contain the given bounds
  //Bounds are calculated given the default center and zoom
  //special note: make sure your lat and lng are floats or googleMaps will error
  const fitBounds = map => {
    //make an empty bounds variable
    const bounds = new window.google.maps.LatLngBounds(); 
    locationData.map(model => {
      const { latitude, longitude } = model.locationData.pos;
      const latLng = new window.google.maps.LatLng(latitude, longitude); //auto adjusts the markers whenever there is zoom/center action
      bounds.extend(latLng); 
      return latLng;
    });
    //adjust the viewport of the map
    //special note: this only needs to be done once, don't put it in a loop
    map.fitBounds(bounds);
  };

  //pops up infowindow  based on the selected marker
  const updatedLocation = mark => {
    //console.log("mark: ", mark);
    setShowInfoWindow(true);
    dispatch({
      type: "SAVE_BOOKING_DATA",
      payload: {
        ...state.bookingData,
        "apptLoc": mark
      }
    });

    if (zoom < 13){
      setZoom(13);
    }
  };

  // console.log("user location", userLocation);

  const renderMap = () => {
    return (
      <Fragment>
        <GoogleMap
          ref={map => map && fitBounds}
          mapContainerStyle={mapStyles}
          zoom={zoom}
          center={defaultCenter}
        >
        
          { locationData.map((mark) => {   
            return(
              <Marker 
                zoom={zoom}
                key={mark.id} 
                position={mark.pos}
                onClick={() => updatedLocation(mark)}
                icon={{
                  url: carMarker,
                  anchor: new window.google.maps.Point(12, 12),
                  scaledSize: new window.google.maps.Size(24, 24)
                }}
              />
            );          
          })}

          {/* Repair shop information window on map */}
          { showInfoWindow && apptLoc.name
          && <InfoWindow 
            position={apptLoc.pos}
            clickable={true}
            onCloseClick={() => setShowInfoWindow(false)}
          >
            <p>{apptLoc.name}</p>
          </InfoWindow>}
            
          { userLocation && (
            <Marker 
              key="userLoc" 
              position={userLocation}
              icon={{
                url: userMarker,
                anchor: new window.google.maps.Point(12, 12),
                scaledSize: new window.google.maps.Size(30, 30)
              }}
            />
          )} 
        </GoogleMap>  
      </Fragment>
    );
  };

  // If the map does not load or it is blocked by the user
  if (loadError) {
    return <div>Map is not working because location has been blocked. </div>;
  }

  return isLoaded ? renderMap() : null;
};

Map.propTypes = {
  userLocation: PropTypes.objectOf(PropTypes.number)
};

export default Map;