import React from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";
import fromUnixTime from "date-fns/fromUnixTime";
import isToday from "date-fns/isToday";
import isYesterday from "date-fns/isYesterday";

import styles from "./ChatMessage.module.scss";

const ChatMessage = ({ message, ownMessage }) => {
  // console.log(message);

  // change unix timestamp into a Date, then format it
  // in DB time in miliseconds, unix in seconds
  const time = fromUnixTime(message.time / 1000);

  let formattedTime;
  if (isToday(time)) {
    formattedTime = `Today, ${format(time, "HH:mm")}`;
  } else if (isYesterday(time)) {
    formattedTime = `Yesterday, ${format(time, "HH:mm")}`;
  } else {
    formattedTime = format(time, "E, d.M.yyyy, HH:mm");
  }


  return (
    <div className={ownMessage ? styles.ownChatMessage : styles.otherChatMessage}>
      <p className={styles.timestamp}>{formattedTime}</p>
      <p>{message.text}</p>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.object,
  ownMessage: PropTypes.bool
};

export default ChatMessage;
