import React, { useEffect, useContext } from "react";
import { BookingContext } from "../../../store/BookingStore";
import Input, { Textarea } from "../../../common/Input";
import useForm from "../../Hooks/useForm";

import layout from "../../../styles/layout.module.scss";
import elements from "../../../styles/elements.module.scss";
import styles from "./CarInfo.module.scss";

const validateCarInfo = (values) => {
  const errors = {};

  if (values) {
    if (!values.model.trim()) {
      errors.model = "Car brand required";
    }

    if (!values.platesNumber.trim()) {
      errors.platesNumber = "Plates number required";
    }

    // plates are 5-8 characters, including the dash
    if (values.platesNumber.trim().length < 5) {
      errors.platesNumber = "Plates number too short, don't forget to use the '-' too.";
    }
    
    if (values.platesNumber.trim().length > 8) {
      errors.platesNumber = "Plates number too long, check for typos.";
    }

    if (!values.year.trim()) {
      errors.year = "Year of production required";
    }

    if (+values.year.trim() < 1900 || +values.year.trim() > new Date().getFullYear()) {
      errors.year = "Year out of range, check for typos";
    }

    if (!values.mileage.trim()) {
      errors.mileage = "Mileage required";
    }

    if (+values.mileage.trim() < 0) {
      errors.mileage = "Mileage can't be under zero";
    }
  }

  return errors;
};

const CarInfo = () => {
  const brandOptions = ["Fiat", "Volvo", "Mercedes", "Audi"];
  
  const [state, dispatch] = useContext(BookingContext);
  const bookingData = state.bookingData;

  useEffect(() => {
    if (!state.bookingData.brand) {
      dispatch({
        type: "SAVE_BOOKING_DATA",
        payload: {
          ...state.bookingData,
          "brand": brandOptions[0]
        }
      });
    }
  }, []);

  const { handleBlur, handleChange, values, errors } = useForm(
    bookingData,
    () => {
      dispatch({type: "SAVE_BOOKING_DATA", payload: values});
      dispatch({type: "HAS_ERRORS", payload: !!Object.keys(errors).length});
    },
    () =>  validateCarInfo(values)
  );

  return (
    <div className={layout.pGeneralX}>
      <h1 className={elements.title}>Car&apos;s Details</h1>
      <form className={layout.flexColumnCenter}>

        <div className={elements.inputGroup}>
          <p className={elements.label}>Brand</p>
          <select 
            name="brand" 
            id="brand" 
            className={elements.input}
            onChange={handleChange} 
            value={values.brand}>
            <option disabled value=""> Select from the list... </option>
            {brandOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            )     
            )}
          </select>
        </div>

        <div className={elements.inputGroup}>
          <p className={elements.label}>Model</p>
          <Input
            type="text"
            name="model"
            className={elements.input}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.model}
            placeholder="Car Model"
            error={errors.model}
          />
        </div>

        <div className={elements.inputGroup}>
          <p className={elements.label}>Registration plates number</p>
          <Input
            type="text"
            name="platesNumber"
            className={elements.input}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.platesNumber}
            placeholder="ex. ABC-123"
            error={errors.platesNumber}
          />
        </div>

        <div className={elements.inputGroup}>
          <p className={elements.label}>Production year</p>
          <Input
            type="number"
            name="year"
            className={elements.input}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.year}
            placeholder="Year"
            error={errors.year}
          />
        </div>

        <div className={elements.inputGroup}>
          <p className={elements.label}>Mileage (in km)</p>
          <Input
            type="number"
            name="mileage"
            className={elements.input}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.mileage}
            placeholder="Mileage"
            error={errors.mileage}
          />
        </div>

        <div className={elements.inputGroup}>
          <Input
            id="file-upload"
            className={styles.fileInput}
            type="file"
            name="carImg"
            accept="image/*"
            onChange={handleChange}/>
          <label htmlFor="file-upload" className={styles.customUploadBtn}>Upload</label>
          { bookingData.carImg && (<p>Uploaded file: {bookingData.carImg.name}</p>)}
        </div>
        { bookingData.carImg && (
          <img src={URL.createObjectURL(bookingData.carImg)} 
            alt="Preview of the attached file" 
            className={styles.carImgPreview} />
        )}

        <div className={elements.inputGroup}>
          <p className={elements.label}>Details</p>
          <Textarea
            name="details"
            className={elements.inputTextarea}
            rows={10}
            cols={15}
            autoFocus="focus"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.details}
            placeholder="Additional information about car issue ..."
            texterror={errors.details}
          />
        </div>
      </form>

    </div>
  );
};

export default CarInfo;
