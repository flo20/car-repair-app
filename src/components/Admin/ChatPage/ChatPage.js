import React from "react";
import { useParams, useHistory } from "react-router-dom";
import Chat from "../../Chat/Chat";
import Loader from "../../../common/Loader";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./ChatPage.module.scss";

const ChatPage = ({ bookingsData }) => {
  const { bookingId } = useParams();
  const history = useHistory();

  const booking = bookingsData.find(booking => booking.bookingId === bookingId);

  if (!booking) return (
    <div>
      <Loader
        primaryText="Loading..."
        secondaryText="If this takes a long time, check for typos in the URL." />
    </div>
  );

  return (
    <>
      <div className={styles.chatHeader}>
        <button className={styles.buttonBack} onClick={() => history.push(`/very/secret/admin/${bookingId}`)}>
          <FontAwesomeIcon icon={faChevronLeft} />
            Back
        </button>
        <div className={styles.chatInfo}>
          <p>Customer: <strong>{booking.name}</strong></p>
          <p>Car: {booking.brand} {booking.model}, {booking.licence_number}</p>
        </div>
      </div>
      <Chat chatroom={bookingId} user="Admin" pushNotificationTo={booking.subscription} />
    </>
  );
};

ChatPage.propTypes = {
  bookingsData: PropTypes.arrayOf(PropTypes.object)
};

export default ChatPage;
