import React, { useContext} from "react";
import Button from "../../../common/Button";
import styles from "./ButtonsBackNext.module.scss";
import { BookingContext } from "../../../store/BookingStore";
import { useHistory } from "react-router-dom";
import axios from "axios";

const ButtonsBackNext = () => {
  const [state, dispatch] = useContext(BookingContext);
  const currentStep = state.currentStep;
  const bookingData = state.bookingData;

  const history = useHistory(); // for redirect
 
  const bookAppointment = () => {
    console.log("Booking appointment...");
    const info = { 
      apptStatus: {id: 1, text: "Booked"},
      shop: bookingData.apptLoc.name,
      date: bookingData.apptDate,
      time: bookingData.apptTime,
      year: bookingData.year,
      name: bookingData.name,
      email: bookingData.email,
      phone: bookingData.number,
      brand: bookingData.brand,
      model: bookingData.model,
      mileage: bookingData.mileage,
      image:bookingData.carImg, 
      details:bookingData.details,
      licence_number:bookingData.platesNumber,
      price: bookingData.price,
      pickup_time:bookingData.pickup_time,
      pickup_date:bookingData.pickup_date,
      subscription:bookingData.subscription
    };

    console.log("info", info);

    axios.post(`${process.env.REACT_APP_API}/booking`, info)
      .then((resp) => {
        console.log(resp);
        //alert(resp.data.message);
        // send initial, welcoming message to the chat of the newly created booking
        axios.post(`${process.env.REACT_APP_API}/chat_post_msg`, {
          name: "Admin",
          text: "Thank you for choosing our services! If you have any questions or want to let us know about anything, use this chat to reach us :)",
          chatroom: resp.data.data.bookingId
        })
          .catch((error) => {
            // even if there's an error with initial message, the booking saves correctly and progress page shows
            console.log("Error trying to create the initial chat message: ", error);
          });
        history.push(`/progress-tracker/${resp.data.data.bookingId}`);
      })
      .catch((error) => {
        alert("There was a problem while saving data. Please try again.");
        console.log(error);
      });
  };
  
  return (
    <div className={styles.buttonsWrap}>
      {/* BOOK PLACE */}
      { currentStep === 1 && (
        <>
          <Button text={"Next"} 
            className={styles.btnNext} 
            disabled={!bookingData.apptLoc.name}
            onClick={() => dispatch({type: "NEXT_STEP"})} />
        </>
      )}

      {/* BOOK TIME */}
      { currentStep === 2 && (
        <>
          <Button text={"Next"} 
            className={styles.btnNext} 
            onClick={() => dispatch({type: "NEXT_STEP"})} />
          <Button text={"Back"} 
            className={styles.btnBack} 
            onClick={() => dispatch({type: "PREVIOUS_STEP"})}/>
        </>
      )}

      {/* CAR INFO */}
      { currentStep === 3 && (
        <>
          <Button text={"Next"} 
            className={styles.btnNext} 
            disabled={state.hasErrors || !bookingData.brand || !bookingData.model || !bookingData.year || !bookingData.mileage} 
            onClick={() => dispatch({type: "NEXT_STEP"})} />
          <Button text={"Back"} 
            className={styles.btnBack} 
            onClick={() => dispatch({type: "PREVIOUS_STEP"})}/>
        </>
      )}

      {/* CONTACT INFO */}
      { currentStep === 4 && (
        <>
          <Button text={"Next"} 
            className={styles.btnNext} 
            disabled={state.hasErrors || !bookingData.name || !bookingData.email || !bookingData.number} 
            onClick={() => dispatch({type: "NEXT_STEP"})} />
          <Button text={"Back"} 
            className={styles.btnBack} 
            onClick={() => dispatch({type: "PREVIOUS_STEP"})}/>
        </>
      )}

      {/* PREVIEW */}
      { currentStep === 5 && (
        <>
          <Button text={"Book"}
            className={styles.btnNext}
            onClick={bookAppointment} 
          />
          <Button text={"Back"} 
            className={styles.btnBack} 
            onClick={() => dispatch({type: "PREVIOUS_STEP"})}/>
        </>
      )}
    </div>
  );
};

export default ButtonsBackNext;
