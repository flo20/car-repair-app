import React, {Fragment, useState} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import triggerNotification from "../../../common/triggerNotification";

import styles from "./TimeEstimates.module.scss";

const TimeEstimates = ({ getBookings, booking }) => {
  const today = new Date().toISOString().split("T")[0];
  const timings = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00" ];
    
  const [estimatedPickup, setEstimatedPickup] = useState({
    date: booking.pickup_date, 
    time: booking.pickup_time,
    availabilityMessage: "Estimated pickup time is not yet available."
  });

  const handleDaysTime = ({target:inputs}) => {
    const daysTime = {...estimatedPickup};
    daysTime[inputs.name] = inputs.value;
    setEstimatedPickup(daysTime);
  };
    
  const saveUpdates = async () => {
    //console.log("Update");
    const availabilities = {
      bookingId: booking.bookingId,
      update: {
        pickup_time: estimatedPickup.time,
        pickup_date: estimatedPickup.date
      }
    };
    try {
      const {data} = await axios.patch(`${process.env.REACT_APP_API}/update-booking/estimatedPickup`,  availabilities);
      console.log("Successfully updated");
      console.log(data);
      if (data.error){
        console.log("ERROR during updating: ", data.error.message);
      }
      else {
        const notificationContent = {
          title: "Estimated pickup time updated",
          body: `Your vehicle will be ready around ${estimatedPickup.time} on ${estimatedPickup.date}!`,
          icon: "/logo512.png",
          urls: `/progress-tracker/${booking.bookingId}`
        };
        triggerNotification(booking.subscription, notificationContent, booking.bookingId);
        getBookings();
      }
    } catch(error){
      console.log("Sorry, unable update");
      console.log(error);
    }
  };

  return (
    <Fragment>
      <p>Choose estimated pickup date and time:</p>
      <div className={styles.container}>
        <div>
          <input type="date" 
            value={estimatedPickup.date} 
            name="date" 
            min={today} 
            onChange={handleDaysTime}
            className={styles.box}
          />
        </div>
     
        <div>
          <select 
            value={estimatedPickup.time} 
            onChange={handleDaysTime} 
            name="time"
            className={styles.box}
          >
            <option value=""> --Please select time -- </option>
            {
              timings.length > 0 ?
                timings.map((time) => (
                  <option key={time}>{time}</option>
                )) : null
            }
          </select>
        </div>
        <div>
          <button  
            className={styles.saveButton}
            onClick={saveUpdates}
            disabled={!estimatedPickup.date || 
              !estimatedPickup.time || 
              (estimatedPickup.date === booking.pickup_date &&
              estimatedPickup.time  === booking.pickup_time)}
          >
            Save
          </button>
        </div>
      </div>
      {(!booking.pickup_date || !booking.pickup_time) ? (
        <p>Pick up time has <strong>not</strong> been estimated yet.</p>
      ) : (
        <p>Previously estimated pickup time is set on <strong>{booking.pickup_date}</strong> at <strong>{booking.pickup_time}</strong>.</p>
      )}
    </Fragment>
  );
};


TimeEstimates.propTypes = {
  booking: PropTypes.object,
  getBookings: PropTypes.func
};
  

export default TimeEstimates;