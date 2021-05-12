import React from "react";
import { useRouteMatch, Link } from "react-router-dom";
import PropTypes from "prop-types";
import Loader from "../../../common/Loader";

import styles from "./BookingsList.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";

const BookingsList = ({ bookingsData }) => {
  const { url } = useRouteMatch();

  const bookingsItems = bookingsData.map(booking => 
    (<tr key={booking.bookingId} className={styles.tRow}>
      {/* <td>{booking.bookingId}</td> */}
      <td>{booking.apptStatus.text}</td>
      <td>{booking.date}</td>
      <td>{booking.licence_number}</td>
      <td>
        <Link to={`${url}/${booking.bookingId}/chat`} >
          <button className={styles.button}><FontAwesomeIcon icon={faComments} size="2x" /></button>
        </Link>
        <Link to={`${url}/${booking.bookingId}`} >
          <button className={styles.button}><FontAwesomeIcon icon={faChevronCircleRight} size="2x" /></button>
        </Link>
      </td>
    </tr>)
  );

  if (bookingsData.length < 1) return (
    <div>
      <Loader
        primaryText="Loading..."
        secondaryText="If this takes a long time, check if your database is not empty." />
    </div>
  );

  return (
    <div>
      <h2>Bookings</h2>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tHead}>
            {/* <th>ID</th> */}
            <th>Status</th>
            <th>Date</th>
            <th>Plates</th>
            <th>Chat/More</th>
          </tr>
        </thead>
        <tbody>
         
          {bookingsItems}
 
        </tbody>
      </table>
    </div>
  );
};

BookingsList.propTypes = {
  bookingsData: PropTypes.arrayOf(PropTypes.object)
};

export default BookingsList;