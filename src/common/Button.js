import React from "react";
import PropTypes from "prop-types";

const Button = ({text, onClick, className, disabled}) => {
  return (
    <button onClick={onClick} className={className} disabled={disabled} >{text}</button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default Button;
