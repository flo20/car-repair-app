import React from "react";
import PropTypes from "prop-types";

import styles from "./Loader.module.scss";

const Loader = ({ primaryText, secondaryText }) => {
  return (
    <div className={styles.loaderContainer}>
      <h2 className={styles.primaryText}>{primaryText}</h2>
      <div className={styles.dashesContainer}>
        <div className={styles.dash1}></div>
        <div className={styles.dash2}></div>
        <div className={styles.dash3}></div>
        <div className={styles.dash4}></div>
      </div>
      <p className={styles.secondaryText}>{secondaryText}</p>
    </div>
  );
};


Loader.propTypes = {
  primaryText: PropTypes.string,
  secondaryText: PropTypes.string,
};
  

export default Loader;

// CSS Dash Loader
// by Cassidy Williams
// https://codepen.io/cassidoo/pen/KRdLvL