const webPush = require("web-push");
const docClient = require("./aws-config");


const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

const subscriptions = {};
var crypto = require("crypto");


//creating hash to replace long subscription token
function createHash(input) {
  const md5sum = crypto.createHash("md5");
  md5sum.update(Buffer.from(input));
  return md5sum.digest("hex");
}
  
//Ask user to subscribe to notifications -- update subscription with the endpoint
function pushNotificationSubscription(req, res){
  const subscription = req.body.subscription;
  //console.log(subscription);
  const subscriptionId = createHash(JSON.stringify(subscription));
  subscriptions[subscriptionId] = subscription;
  //const hashedId = { id: subscriptionId };
  
  const params = {
    TableName: "Bookings",
    Key: { "bookingId": req.body.bookingId },
    UpdateExpression: "set subscription = :s",
    ExpressionAttributeValues: {
      ":s": subscriptionId
    },
    ReturnValues: "UPDATED_NEW" 
  };
  
  //console.log(params);
  docClient.update(params, function(err, data) {
    if (err) {
      res.json({ "error": err, "data": data });
      console.log("Could not update subscribtion token");
    } else {
      res.json({ "error": false, "data": data.Attributes, "hashedId": { id: subscriptionId } });
      console.log("Successfully updated with the subscription token");
    }
  });
}
  
  
//Get the subscription token and send push notifications to customer
function sendPushNotification (req, res){
  const subscriptionId = req.params.pushServerSubscriptionId; //user's hash = subscription token
  console.log("Push notification", subscriptionId); 
  const pushSubscriptionKey = subscriptions[subscriptionId];
  const params = {
    TableName: "Bookings",
    Key: {"bookingId": subscriptionId }
  };
  
  const payload = JSON.stringify({
    title: req.body.notificationTitle,
    body: req.body.notificationBody,
    icon: req.body.notificationIcon,
    urls: req.body.notificationUrl
  });

  const options = {
    vapidDetails:{
      subject:"mailto:florence.anipa@druid.com",
      publicKey:publicVapidKey,
      privateKey:privateVapidKey
    }
  };
  
  //initial pushing notifications to client
  //sendNotification payload accepts only string
  webPush.sendNotification(JSON.parse(pushSubscriptionKey), payload, options)
    .then(result => console.log(result))
    .catch(error => console.log("Hello", error));
  //console.log("Yay,pushed user's token and notification details.");
  
  docClient.get(params, function(err, data) {
    if (err) {
      res.json({ "error": err, "data": data });
      console.log("Could not get subscriber's token.");
    } else {
      res.json({ "error": false, "data": params });
      console.log("Got user's push subscription token. I can push messages now!");
    }
  });
}
  
//get all subscription tokens
function getAllSubscriptions (req, res) {
  const params = {
    TableName: "Bookings"
  };
  
  docClient.scan(params, function(err, data) {
    if (err) {
      res.json({ "error": err, "data": data });
    } else {
      res.json({ "error": false, "data": data.Items });
    }
  });
}


module.exports = 
{ 
  pushNotificationSubscription, 
  sendPushNotification, 
  getAllSubscriptions
};
