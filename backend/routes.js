const express = require("express");
const { mercureTestMsg, postChat, getChat, deleteChat } = require("./services/chat-services");
const { postBooking, getBookingById, getAllBookingData, updateBooking, deleteBooking} = require("./services/booking-services");
const { pushNotificationSubscription, sendPushNotification, getAllSubscriptions } = require("./services/notification-services");
const baseController = require("./controllers/baseControllers");
const validationMiddleware = require("./middleware/validation-middleware");

module.exports = function(app, router, apiRoute) {
  app.use(express.json());
  app.use(express.urlencoded({
    extended: true
  }));

  router.get("/", function(req, res) {
    res.end("Hello world!");
  });

  // Mercure connection testing - send a message with a random string
  // to everyone subscribed to the topic https://our-app.com/hello-world
  router.get("/mercure-test", mercureTestMsg);

  // send a new message to a specific chat
  router.post("/chat_post_msg", postChat);
  
  // get all messages from specific chat room/specific booking
  router.get("/chat/:chatroom", getChat);

  // delete all chat messages of a specific bookingId/chatroom
  router.delete("/chat/:chatroom", deleteChat);

  //save new data of booking information 
  router.post("/booking", validationMiddleware, baseController.index, postBooking);

  //get one booking by booking ID
  router.get("/bookings/id/:bookingId", getBookingById);

  // get all bookings
  router.get("/all-bookings", getAllBookingData);

  // update existing booking entry - patch with partial data
  router.patch("/update-booking/:updateValues", updateBooking);

  //delete booking info of user from db
  router.delete ("/delete-booking/:bookingId", deleteBooking);

  //Subscribe route for notification
  router.patch("/subscribe", pushNotificationSubscription);

  //Ask user to subscribe and push any notification
  router.post("/subscribe/:pushServerSubscriptionId", sendPushNotification);

  //View all subscriptions
  router.get("/all-subscribtions", getAllSubscriptions);

  app.use(apiRoute, router);
};

