import React, { useContext } from "react";
import { BookingContext } from "../../../store/BookingStore";
import Input from "../../../common/Input";
import useForm from "../../Hooks/useForm";
import Joi from "joi-browser";

import layout from "../../../styles/layout.module.scss";
import elements from "../../../styles/elements.module.scss";

const validateContactInfo = (values) => {
  const errors = {};
  const emailSchema = Joi.string().email();

  if (values) {
    if (!values.name.trim()) {
      errors.name = "Name required";
    }

    if (!values.email.trim()) {
      errors.email = "Email required";
    }

    if (values.email.trim()) {
      let results = Joi.validate(values.email, emailSchema, {abortEarly:false});
      if (results.error) {
        errors.email = "Invalid email address";
      }
    }

    if (!values.number.trim() ) {
      errors.number = "Phone number required";
    }

    if (+ values.number.trim() < 10) {
      errors.number = "Invalid phone number";
    }

    // TO DO: validate phone number further, require specific format?
  }

  return errors;
};

const ContactForm = () => {
  const [state, dispatch] = useContext(BookingContext);
  const bookingData = state.bookingData;

  const { handleBlur, handleChange, values, errors } = useForm(
    bookingData,
    () => {
      dispatch({type: "SAVE_BOOKING_DATA", payload: values});
      dispatch({type: "HAS_ERRORS", payload: !!Object.keys(errors).length});
    },
    () =>  validateContactInfo(values)
  );

  return (
    <div className={layout.pGeneralX}>
      <h1 className={elements.title}>Contact Details</h1>
      <form className={layout.flexColumnCenter}>

        <div className={elements.inputGroup}>
          <p className={elements.label}>Name</p>
          <Input 
            type="text"
            name="name" 
            className={elements.input}
            onChange={handleChange} 
            onBlur={handleBlur}
            value={bookingData.name} 
            placeholder="Name" 
            error={errors.name}/>
        </div>

        <div className={elements.inputGroup}>
          <p className={elements.label}>Email</p>
          <Input 
            type="email" 
            name="email" 
            className={elements.input}
            onChange={handleChange} 
            onBlur={handleBlur}
            value={bookingData.email} 
            placeholder="Email" 
            error={errors.email}/>
        </div>

        <div className={elements.inputGroup}>
          <p className={elements.label}>Phone number</p>
          <Input 
            type="number" 
            name="number" 
            className={elements.input}
            onChange={handleChange} 
            onBlur={handleBlur}
            value={bookingData.number} 
            placeholder="Phone number" 
            error={errors.number}/>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
