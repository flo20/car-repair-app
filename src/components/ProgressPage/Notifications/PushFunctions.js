const PushFunctions = () => {
  /**
   * checks if Push notification and service workers are supported by user's browser
   */
  function isPushNotificationSupported() {
    return "serviceWorker" in navigator && "PushManager" in window;
  }
  /**
   * asks user consent to receive push notifications and 
   * returns the response of the user, one of granted, default, denied
   */
  function initializePushNotifications() {
    // request user grant to show notification
    return Notification.requestPermission(function(result) {
      return result;
    });
  }
  
  
  /**
   * returns the subscription if present or nothing
   */
  function getUserSubscription() {
    //wait for service worker installation to be ready, and then
    return navigator.serviceWorker.ready
      .then(function(serviceWorker) {
        return serviceWorker.pushManager.getSubscription();
      })
      .then(function(pushSubscription) {
        //console.log("Got subscription");
        return pushSubscription;
      });
  }

  return { 
    isPushNotificationSupported,
    initializePushNotifications,
    getUserSubscription
  };  
};

export default PushFunctions;