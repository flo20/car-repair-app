import React, { useState } from "react";
import { Link, useRouteMatch, useParams, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import triggerNotification from "../../../common/triggerNotification";

import TimeEstimates from "../TimeEstimates/TimeEstimates";
import Loader from "../../../common/Loader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-solid-svg-icons";

import styles from "./BookingDetails.module.scss";
//import icon from "./../../../assets/logo512.png";

const BookingDetails = ({ bookingsData, getBookings }) => {
  const { url } = useRouteMatch(); // url of this detail page, incl the booking ID
  const { bookingId } = useParams();
  const history = useHistory();

  const availableStatuses = [
    {
      id: 1,
      text: "Booked"
    },
    {
      id: 2,
      text: "Queue"
    },
    {
      id: 3,
      text: "Repairs"
    },
    {
      id: 4,
      text: "Finished"
    },
    {
      id: 5,
      text: "Picked"
    }
  ];

  const booking = bookingsData.find(booking => booking.bookingId === bookingId);
  console.log(booking);

  const [newStatus, setNewStatus] = useState({});
  const [updatedPrice, setUpdatedPrice] = useState("");
  const randomPrices = ["200€", "2500€", "3000€", "3500€", "4000€", "4500€", "5000€", "5500€", "600€", "750€" ];

  const handleStatusChange = ({target}) => {
    const selectedStatus = availableStatuses.find(status => status.text === target.value);
    setNewStatus(selectedStatus);
  };

  const handlePriceChange = (e) => {
    console.log("Price change");
    setUpdatedPrice(e.target.value);
  };

  const saveChanges = (updatedStatus) => {
    // console.log(updatedStatus);
    const data = {
      bookingId: bookingId,
      update: updatedStatus
    };
    
    axios.patch(`${process.env.REACT_APP_API}/update-booking/apptStatus`, data)
      .then(res => {
        console.log("updateItem response: ", res.data);
        if (res.data.error) {
          console.log("ERROR during updating: ", res.data.error.message);
        } else {
          const notificationContent = {
            title: "Appointment status updated",
            body: `Your appointment is in stage ${updatedStatus.text} now!`,
            icon: "/logo512.png",
            urls: `/progress-tracker/${bookingId}`
          };
          triggerNotification(booking.subscription, notificationContent, bookingId);
          getBookings();
        }
      })
      .catch(err => {
        console.log("error: ", err);
      });
  };

  // Save button for Prices
  const savePriceChanges = (updatedPrices) => {
    //console.log("Updated price");
    const priceData = {
      bookingId: bookingId,
      price: updatedPrices
    };
    
    axios.patch(`${process.env.REACT_APP_API}/update-booking/estimatedPrice`, priceData)
      .then(res => {
        console.log("updateItem response: ", res.data);
        if (res.data.error) {
          console.log("ERROR during updating: ", res.data.error.message);
        } else {
          const notificationContent = {
            title: "Estimated price has changed",
            body: `Estimated price is now ${updatedPrices}!`,
            icon: "/logo512.png",
            urls: `/progress-tracker/${bookingId}`

          };
          triggerNotification(booking.subscription, notificationContent, bookingId);
          getBookings();
        }
      })
      .catch(err => {
        console.log("error: ", err);
      });

  };


  if (!booking) return (
    <div>
      <Loader
        primaryText="Loading..."
        secondaryText="If this takes a long time, check for typos in the URL." />
    </div>
  );

  return (
    <div>
      <div className={styles.buttonsWrap}>
        <button className={styles.buttonBack} onClick={() => history.push("/very/secret/admin")}>
          <FontAwesomeIcon icon={faChevronLeft} />
            Back
        </button>
        <Link to={`${url}/chat`} >
          <button className={styles.button}>
            <FontAwesomeIcon icon={faComments} />
              Chat
          </button>
        </Link>
      </div>
  
      <h2>Details</h2>
      <h3>Status: {booking.apptStatus.text}</h3>

      {/* CHANGING THE STATUS */}

      <label htmlFor="changeStatus">
        <p>Change status:</p>
      </label>
      <select 
        name="changeStatus" 
        id="changeStatus" 
        value={newStatus.text || booking.apptStatus.text} 
        onChange={handleStatusChange}
        className={styles.inputField}
      >
        {availableStatuses.length > 0 ? 
          availableStatuses.map((status) => (
            <option key={status.id} value={status.text}>{status.id}. {status.text}</option>
          ))
          : null}
      </select>
      <button 
        className={styles.saveButton}
        onClick={() => saveChanges(newStatus)}
        disabled={!newStatus.text || newStatus.text === booking.apptStatus.text}
      >
            Save
      </button>

      {/* END OF CHANGING THE STATUS */}

      {/* DROP DOWN FOR PRICE ESTIMATION */}
      <label htmlFor="prices">
        <p>Update price:</p>
      </label>
      <select 
        name="prices" 
        id="prices" 
        value= {updatedPrice || booking.price}
        onChange={handlePriceChange}
        className={styles.inputField}
      >
        {randomPrices.length > 0 ? 
          randomPrices.map((price) => (
            <option key={price} value={price}>{price}</option>
          ))
          : null}
      </select>
      <button 
        className={styles.saveButton}
        onClick={() => savePriceChanges(updatedPrice)}
        disabled={!updatedPrice || updatedPrice === booking.price}
      >
            Save
      </button>
      {/* END OF DROP DOWN FOR PRICE ESTIMATION */}
       
      <TimeEstimates getBookings={getBookings} booking={booking} />
  
      <h3>Appointment</h3>
      <p>ID: {bookingId}</p>
      <p>{booking.date} {booking.time} at {booking.shop}</p>
  
      <hr />
  
      <h3>Contact</h3>
      <p>{booking.name}</p>
      <p>{booking.phone}</p>
      <p>{booking.email}</p>
  
      <hr />
  
      <h3>Car</h3>
      <p>Plates: {booking.licence_number}</p>
      <p>{booking.brand} {booking.model}</p>
      <p>Produced in {booking.year}, {booking.mileage} km driven</p>
      { booking.details && (
        <>
          <p>Details:</p>
          <p>{booking.details}</p>
        </>
      )}
      {/* { booking.image && (
                  <img src="" alt="attached file of the car" />
              )} */}
    </div>
  );
};

BookingDetails.propTypes = {
  bookingsData: PropTypes.arrayOf(PropTypes.object),
  getBookings: PropTypes.func
};

export default BookingDetails;