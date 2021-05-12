
function receivePushNotification(event){
  //console.log("[Service Worker] Push Received.");
  const {title, body, icon, urls} = event.data.json();
  console.log("Events", event.data.json());

  const options = {
    body: body,
    icon: icon,
    data: urls
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
}

function openPushNotification(event) {
  console.log("[Service Worker] Notification click Received.", event.notification.data);
  event.notification.close();
  //console.log("Closed notification");
  
  event.waitUntil(self.clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == "/" && "focus" in client)
        return client.focus();
      //console.log("Testing focus");
    }
    if(self.clients.openWindow){
      //console.log("Window has been opened");
      return self.clients.openWindow(event.notification.data);
    }
  }));
}

self.addEventListener("notificationclick", openPushNotification);
self.addEventListener("push", receivePushNotification);