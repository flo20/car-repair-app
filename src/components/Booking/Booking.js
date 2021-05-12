import React, { useContext } from "react";
import { BookingContext } from "../../store/BookingStore";
import BookingPreview from "./BookingPreview/BookingPreview";
import BookPlace from "./BookPlace/BookPlace";
import BookTime from "./BookTime/BookTime";
import ButtonsBackNext from "./ButtonsBackNext/ButtonsBackNext";
import CarInfo from "./CarInfo/CarInfo";
import ContactForm from "./ContactForm/ContactForm";

import styles from "./Booking.module.scss";

const Booking = () => {

  const [state] = useContext(BookingContext);
  const currentStep = state.currentStep;

  return (
    <div className={styles.bookingPage}>
      <div className={styles.bookingStep}>
        { currentStep === 1 && <BookPlace /> }
        { currentStep === 2 && <BookTime /> }
        { currentStep === 3 && <CarInfo /> }
        { currentStep === 4 && <ContactForm /> }
        { currentStep === 5 && <BookingPreview /> }
      </div>
      <ButtonsBackNext />
    </div>
  );
};

export default Booking;
