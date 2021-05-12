import React, {createContext, useReducer} from "react";
import BookingReducer from "../reducers/BookingReducer";
import PropTypes from "prop-types";

const today = new Date().toISOString().split("T")[0];
const initialState = {
  bookingData: {
    apptDate: today, // in yyyy-mm-dd format
    apptTime: "",
    apptLoc: {
      name: "",
      pos: {
        lat: "", // Number
        lng: "" // Number
      },
      id: "" // Number
    },
    brand: "",
    model: "",
    platesNumber: "",
    year: "",
    mileage: "",
    details: "",
    carImg: "", // not String, but File (a specific kind of Blob)
    name: "",
    email: "",
    number: "",
    price: "",
    pickup_time:"",
    pickup_date: "",
    subscription: ""
  },
  currentStep: 1,
  hasErrors: false
};

const BookingStore = ({ children }) => {
  // console.log(children);
  const [state, dispatch] = useReducer(BookingReducer, initialState);
  return (
    <BookingContext.Provider value={[state, dispatch]}>
      {children}
    </BookingContext.Provider>
  );
};

BookingStore.propTypes = {
  // children: PropTypes.element
  children: PropTypes.array
};

export const BookingContext = createContext(initialState);
export default BookingStore;
