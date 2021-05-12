import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import getEventSource from "../../common/getEventSource";
import triggerNotification from "../../common/triggerNotification";

import ChatMessage from "./ChatMessage";
import Input from "../../common/Input";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import styles from "./Chat.module.scss";

const Chat = ({ chatroom, user, pushNotificationTo }) => {
  // Mercure
  useEffect(async () => {
    // topics to subscribe to
    const topics = [
      `https://our-app.com/booking-chat/${chatroom}`
    ];

    const eventSource = await getEventSource(topics);


    eventSource.onerror = err => console.error("Error establishing chat stream: ", err);
    eventSource.onopen = () => console.log("Chat stream open");

    // The callback will be called every time an update is published to the topics we're subscribed to
    eventSource.onmessage = e => {
      const update = JSON.parse(e.data);
      // console.log("mercure update", update);

      if (update.message.name === user) {
        console.log("the update is from me");
      }

      // add new received message to the state array
      // it re-renders the display
      setMessages(oldArray => [...oldArray, update.message]);

      // make sure that with every new message the display scrolls down to show the newest message
      scrollToBottomChat();

      // TO DO: write logic for the general messages/ads that will be sent to all users at once. It shouldn't be appended in the chat, but in a separate place (an ads box/carousel)
    };

    // when the Chat component unmounts, close the connection
    return function cleanup() {
      console.log("Closing chat connection...");
      eventSource.close();
    };
  }, []);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const getChatMessages = async() => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API}/chat/${chatroom}`);
        setMessages(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getChatMessages(); 
  }, []);
  
  useEffect(() => {
    // on load try to scroll chat display to the bottom
    // usually the html is not rendered yet when it fires
    // so try again when the chat display div appears
    scrollToBottomChat();
  }, [document.getElementById("chatDisplay")]);

  const scrollToBottomChat = () => {
    const displayDiv = document.getElementById("chatDisplay");
    displayDiv.scrollTop = displayDiv.scrollHeight;
  };

  const handleChange = ({target}) => {
    setNewMessage(target.value);
  };

  const submitMessage = async (event, message) => {
    event.preventDefault();
    if (!message) return;
    
    try {
      const {data} = await axios.post(`${process.env.REACT_APP_API}/chat_post_msg`, {
        name: user,
        text: message,
        chatroom: chatroom
      });
      console.log("response after sending new message:", data);
      setNewMessage("");
      // if it's the admin sending a new message,
      // trigger notification to the user with user's subscription hash
      if (user === "Admin") {
        // show max 50 first characters of the message
        let formattedMessage;
        message.length > 50 ? formattedMessage = `${message.substring(0, 50)}...` : formattedMessage = message;

        const content = {
          title: "New Chat Message",
          body: formattedMessage,
          icon: "/logo512.png",
          urls: `/progress-tracker/${chatroom}`
        };
        
        triggerNotification(pushNotificationTo, content, chatroom);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // console.log("Current user: ", user);

  return (
    <>
      <div className={styles.chatDisplay} id="chatDisplay">
        { messages.length === 0 ?
          (<div className={styles.loadingChat}> 
            <h2>Loading messages...</h2>
          </div>) :
          (messages.map((message) => {
            let ownMessage = false;
            if (message.name === user) ownMessage = true;
            return  (
              <ChatMessage key={message.messageId} message={message} ownMessage={ownMessage} />
            );
          }
          ))
        }
      </div>

      <form 
        onSubmit={(event) => submitMessage(event, newMessage)}
        className={styles.chatForm}>
        <Input
          type="text"
          name="message"
          className={styles.chatInput}
          onChange={handleChange}
          value={newMessage}
          placeholder="Type message..."
        />
        <button 
          type="submit"
          className={styles.sendBtn} >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </form>
    </>
  );
};

Chat.propTypes = {
  chatroom: PropTypes.string,
  user: PropTypes.string,
  pushNotificationTo: PropTypes.string
};

export default Chat;
