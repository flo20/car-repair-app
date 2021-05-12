import PushFunctions from "./PushFunctions";
const {
  initializePushNotifications, 
  isPushNotificationSupported, 
  getUserSubscription, 
}  = PushFunctions();

export function askUserPermission() {
  if (isPushNotificationSupported) {
    console.log("Service worker is supported and registered to service worker");
    //ask the user consent to receive push notification
    console.log("Asking user to make a subscription request.");
    initializePushNotifications()
      .then(function (consent) {
        if(consent === "granted"){
          getUserSubscription();
          console.log("You have my consent to push messages");
        } else if(consent === "denied") {
          console.log("Permission denied");
        }
      })
      .catch((error) => console.error(error));
  }
}