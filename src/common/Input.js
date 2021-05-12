import React from "react";
import PropTypes from "prop-types";


const Input = ({name, id, type, className, onChange, onBlur, value, placeholder, error, accept}) => {
  return (
    <>
      <input 
        name={name} 
        id={id}
        type={type} 
        className={className}
        onChange={onChange} 
        onBlur={onBlur} 
        value={value}
        placeholder={placeholder} 
        accept={accept}/>  
      {error && <div style={{color:"red"}}>{error}</div>} 
    </>
  );
};

export const Textarea = ({name, className, rows, cols, onChange, onBlur, value, placeholder, texterror}) => {
  return(
    <>
      <textarea 
        name={name} 
        rows={rows}
        cols={cols}
        className={className}
        onChange={onChange} 
        onBlur={onBlur} 
        value={value}
        placeholder={placeholder}/> 
      {texterror && <div style={{color:"red"}}>{texterror}</div>} 
    </>
  );
};

Input.propTypes = {
  name: PropTypes.string,
  id: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string, // for most
    PropTypes.object // for image blob
  ]),
  placeholder: PropTypes.string,
  error: PropTypes.string,
  accept: PropTypes.string
};

Textarea.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  rows: PropTypes.number,
  cols: PropTypes.number,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  texterror: PropTypes.string,
};

export default Input;
