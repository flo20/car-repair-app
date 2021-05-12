import axios from "axios";

const triggerNotification = async (bookingSubscription, notificationContent) => {
  try {
    const pushServerSubscriptionId = bookingSubscription;
    console.log(pushServerSubscriptionId);
    if (!pushServerSubscriptionId || pushServerSubscriptionId == "") {
      console.log("Subscription hash is empty");
      return;
    }
    const notificationData = {
      notificationTitle: notificationContent.title,
      notificationBody: notificationContent.body,
      notificationIcon: notificationContent.icon,
      notificationUrl: notificationContent.urls
    };
    const {data, error} = await axios.post(`${process.env.REACT_APP_API}/subscribe/${pushServerSubscriptionId}`, notificationData);
    console.log(data, error);
  } catch(err) {
    console.log(err);
  }
};


export default triggerNotification;