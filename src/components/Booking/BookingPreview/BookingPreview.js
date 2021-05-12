import React, { useContext } from "react";
import { BookingContext } from "../../../store/BookingStore";

//import Button from "../../../common/Button";


import styles from "./BookingPreview.module.scss";
import layout from "../../../styles/layout.module.scss";
import elements from "../../../styles/elements.module.scss";

const BookingPreview = () => {
  const [state] = useContext(BookingContext);
  const bookingData = state.bookingData;

  return (
    <div className={layout.pGeneralX}>
      <h1 className={elements.title}>Booking Preview</h1>

      <h3>The appointment</h3>
      <p>{bookingData.apptLoc.name}, {bookingData.apptDate} at {bookingData.apptTime}</p>

      <hr/>

      <h3>Personal info</h3>
      <p>{bookingData.name}, {bookingData.email}, {bookingData.number}</p>

      <hr/>

      <h3>Car info</h3>
      <p>{bookingData.platesNumber}, {bookingData.brand} {bookingData.model}, year {bookingData.year}, {bookingData.mileage} km</p>
      <p> Details: {bookingData.details}</p>
      
      <hr/>
      
      { bookingData.carImg && (
        <>
          <p>Image attached:</p>
          <img 
            className={styles.img} 
            src={URL.createObjectURL(bookingData.carImg)} 
            alt="Attached image of the car"></img>
        </>
      )}
      
    </div>
  );
};

export default BookingPreview;
