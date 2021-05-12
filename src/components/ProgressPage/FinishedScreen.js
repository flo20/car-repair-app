import React from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

import styles from "./FinishedScreen.module.scss";



const FinishedScreen = ({bookingId}) => {
 
  const handleDelete = async() => {
    console.log("Deleted");
    try{
      const {data} = await axios.delete(`${process.env.REACT_APP_API}/delete-booking/${bookingId}`);
      const chatroom = bookingId;
      //console.log(chatroom);
      const {deletedData} = await axios.delete(`${process.env.REACT_APP_API}/chat/${chatroom}`);
      console.log(data);
      console.log(deletedData);
    } catch(error){
      console.log(error);
    }
  };
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Thank you for using our service</h3>  
    
      <Link to="/">
        <button onClick={handleDelete}   className={styles.btnClose} >
      Close
        </button>
      </Link>
    </div>
  );
};

FinishedScreen.propTypes = {
  bookingId: PropTypes.string,
};

export default FinishedScreen;
