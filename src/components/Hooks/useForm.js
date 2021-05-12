import { useState, useEffect } from "react";

const useForm = (initialValues, callback, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = event => {
    const { name, value } = event.target;
    if (name === "carImg") {
      setValues({
        ...values,
        "carImg": event.target.files[0]
      });
    } else {
      setValues({
        ...values,
        [name]: value
      });
    }
  };

  const handleBlur = () => {
    setErrors(validate());
  };

  useEffect(
    () => {
      callback();
    },
    [errors, values]
  );

  return { handleChange, handleBlur, values, errors };
};

export default useForm;
