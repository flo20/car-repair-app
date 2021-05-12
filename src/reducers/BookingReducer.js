const BookingReducer = (state, action) => {
  switch (action.type) {
  case "SAVE_BOOKING_DATA":
    return {
      ...state,
      bookingData: {
        ...action.payload
      }
    };
  case "HAS_ERRORS":
    return {
      ...state,
      hasErrors: action.payload  // boolean
    };
  case "NEXT_STEP":
    return {
      ...state,
      currentStep: state.currentStep + 1
    };
  case "PREVIOUS_STEP":
    return {
      ...state,
      currentStep: state.currentStep - 1
    };
  default:
    return state;
  }
};

export default BookingReducer;
