import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getEventSource from "../../common/getEventSource";

import axios from "axios";

import Loader from "./../../common/Loader";
import CustomerCarStatus from "./ProgressBar/CustomerCarStatus";
import Chat from "../Chat/Chat";
import {askUserPermission} from "../ProgressPage/Notifications/PushNotifications";


import styles from "./ProgressPage.module.scss";
import FinishedScreen from "./FinishedScreen";

const ProgressPage = () => {
  const { bookingId } = useParams();
  const [initialBookingData, setInitialBookingData] = useState("");
  const [bookingData, setBookingData] = useState("");

  useEffect(() => {
    askUserPermission();
    createNotificationSubscription();
  }, []);

  useEffect(() => {
    const getBookingData = async() => {
      try {
        const {data} = await axios.get(`${process.env.REACT_APP_API}/bookings/id/${bookingId}`);
        setBookingData(data.data);
        setInitialBookingData(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getBookingData(); 
  }, []);


  //Used to pass into the subscribe call
  function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
    
  // const publicVapidKey = "BOOzVbBPxrE8zCf6RQ4YiwPv8wX0mVvLU8MmqyffKrg2ev7Eu1_shP_tpj0iFeZZMt7-vtwe5PBgf0C27_Zkc_g";
  const publicVapidKey = process.env.REACT_APP_PUBLIC_VAPID_KEY;
  /**
   * 
   * using the registered service worker creates a 
   * push notification subscription and returns it
   * 
   */
  const createNotificationSubscription = () => {
    //wait for service worker installation to be ready, and then
    return navigator.serviceWorker.ready
      .then(function(serviceWorker) {
      // user subscribes 
        serviceWorker.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
          })
          .then(function(subscription) {
          //sends the push susbcribtion to the push server
            console.log("User is subscribed.", subscription);
            //return pushServerSubscriptionId;
            const updateSubscriptionData = async() => {
              const updateSubscription = {
                bookingId : bookingId,
                subscription:JSON.stringify(subscription) // will need for the admin side
              };
              console.log(updateSubscription);
              try {
                const {data} = await axios.patch(`${process.env.REACT_APP_API}/subscribe`, updateSubscription,  
                  {headers: {
                    "Content-Type": "application/json"
                  }});
                console.log("Successfully updated subscription", data);
              } catch(error){
                console.log(error);
              }
            };
            updateSubscriptionData();
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };
  
  // Mercure
  useEffect(async () => {
    if (initialBookingData) {
      // topics to subscribe to
      const topics = [
        `https://our-app.com/booking-update/${bookingData.bookingId}`
      ];
    
      const eventSource = await getEventSource(topics);
    

      eventSource.onerror = err => console.error("Error establishing Progress Page stream: ", err);
      eventSource.onopen = () => console.log("Progress Page stream open");
      
      // The callback will be called every time an update is published to the topics we're subscribed to
      eventSource.onmessage = e => {
        const update = JSON.parse(e.data);
        console.log("mercure update", update);
  
        // appointment status change
        if (update.message.type === "status-update") {
          setBookingData({
            ...bookingData,
            apptStatus: update.message.updatedStatus
          });
        }

        // estimated pick-up time change
        if (update.message.type === "pickup-time-update") {
          setBookingData({
            ...bookingData,
            pickup_time: update.message.updatedPickup.time,
            pickup_date: update.message.updatedPickup.date
          });
        }
        // estimated price change
        if (update.message.type === "estimated-price-update") {
          setBookingData({
            ...bookingData,
            price: update.message.price,
          });
        }
      };
      console.log(bookingData);
      // when the ProgressPage component unmounts, close the connection
      return function cleanup() {
        console.log("Closing progress page connection...");
        eventSource.close();
      };
    }
  
  }, [initialBookingData]);


  if (!bookingData) return (
    <div>
      <Loader
        primaryText="Loading your data..."
        secondaryText="" />
    </div>
  );


  return (
    
    <div className={styles.pageWrapper}>
      <CustomerCarStatus bookingData={bookingData} />
      {
        (bookingData.apptStatus.text === "Picked") ? 
          <FinishedScreen bookingId={bookingId}/>  :
          <Chat chatroom={bookingId} user={bookingData.name} pushNotificationTo="" />
      }
    </div>
  );
};
  
export default ProgressPage;
