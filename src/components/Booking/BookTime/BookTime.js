import React, { useEffect, useContext } from "react";
import { BookingContext } from "./../../../store/BookingStore";

import layout from "../../../styles/layout.module.scss";
import elements from "../../../styles/elements.module.scss";

const BookTime = () => {
  const today = new Date().toISOString().split("T")[0];
  const times = ["8:30", "10:30", "12:00", "12:30", "14:00", "14:45", "16:00"];

  const [state, dispatch] = useContext(BookingContext);
  const bookingData = state.bookingData;

  useEffect(() => {
    if (!state.bookingData.apptTime) {
      dispatch({
        type: "SAVE_BOOKING_DATA",
        payload: {
          ...state.bookingData,
          "apptTime": times[0]
        }
      });
    }
  }, []);

  const handleInputChange = (e) => {
    dispatch({
      type: "SAVE_BOOKING_DATA",
      payload: {
        ...state.bookingData,
        [e.target.name]: e.target.value
      }
    });
  };
  
  return (
    <div className={layout.pGeneralX}>
      <div>
        <label htmlFor="apptDate">
          <h1 className={elements.title}>Choose a date:</h1>
        </label>
      </div>
      <div className={layout.flexCenter}>
        <input 
          className={elements.input}
          type="date" 
          name="apptDate" 
          id="apptDate" 
          value={bookingData.apptDate}
          min={today} 
          onChange={(e) => handleInputChange(e)}></input>
      </div>

      <div>
        <label htmlFor="apptTime">
          <h1 className={elements.title}>Choose a time:</h1>
        </label>
      </div>
      <div className={layout.flexCenter}>
        <select 
          className={elements.input}
          name="apptTime" 
          id="apptTime" 
          value={bookingData.apptTime} 
          onChange={(e) => handleInputChange(e)}>
          {times.length > 0 ? 
            times.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))
            : null}
        </select>
      </div>
    </div>
  );
};

export default BookTime;
