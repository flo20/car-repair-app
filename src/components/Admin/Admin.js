import React, { useState, useEffect } from "react";
import axios from "axios";
import getEventSource from "../../common/getEventSource";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import BookingsList from "./BookingsList/BookingsList";
import BookingDetails from "./BookingDetails/BookingDetails";
import ChatPage from "./ChatPage/ChatPage";
//import bookingsData from "../../mocks/bookings-data.json";

import layout from "../../styles/layout.module.scss";
// import elements from "../../styles/elements.module.scss";

const Admin = () => {
  const { url } = useRouteMatch();
  const [bookingsData, setBookingsData] = useState([]);
  const [error, setError] = useState("");

  useEffect(async () => {
    // Mercure watching for changes in bookings data
    
    // topics to subscribe to
    const topics = [
      "https://our-app.com/update-bookings-list"
    ];

    const eventSource = await getEventSource(topics);



    eventSource.onerror = err => console.error("Error establishing All Bookings stream: ", err);
    eventSource.onopen = () => console.log("All Bookings stream open");

    eventSource.onmessage = e => {
      const update = JSON.parse(e.data);
      console.log("update to all bookings", update);

      if (update.message.type === "new-booking") {
        console.log("new booking: ", update.message.booking);
        
        setBookingsData(oldArray => [...oldArray, update.message.booking]);
      }
    };

    getBookings();

    return function cleanup() {
      console.log("Closing all-bookings connection...");
      eventSource.close();
    };
  }, []);

  const getBookings = () => { 
    axios.get(`${process.env.REACT_APP_API}/all-bookings`)
      .then(res => {
        console.log("getBookings response: ", res);
        if (res.data.error.code === "UnknownEndpoint") {
          setError("Probably there is a problem to connect to the database. Try again later.");
        }
        if (res.data.error.code === "ResourceNotFoundException") {
          setError("Trying to perform operations on a non-existent table. Check if your table names are correct, especially if you are developing locally.");
        }
        if (res.data.data) {
          setBookingsData(res.data.data);
        }
      })
      .catch(err => {
        console.log("error: ", err);
      });
  };

  if (error && bookingsData.length === 0) {
    return (
      <div className={layout.mGeneral}>
        <h1>Something went wrong</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={layout.pGeneral}>
      <div>
        <Switch>
          <Route exact path={`${url}`}>
            <BookingsList bookingsData={bookingsData}/>
          </Route>
          <Route exact path={`${url}/:bookingId`}>
            <BookingDetails bookingsData={bookingsData} getBookings={getBookings} />
          </Route>
          <Route path={`${url}/:bookingId/chat`}>
            <ChatPage bookingsData={bookingsData} />
          </Route>
        </Switch>
      </div>  
    </div>
  );
};

export default Admin;
