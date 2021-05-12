const https = require("https");
const http = require("http");
const querystring = require("querystring");

// Mercure
const mercureTriggerUpdate = (topic, message) => {

  const postData = querystring.stringify({
    topic: `https://our-app.com${topic}`,
    data: JSON.stringify({ "message": message }),
  });
  
  console.log("Sending message to specific booking through Mercure");
  console.log("- Topic: ", topic);
  console.log("- Payload: ", message);
  console.log("-Token: ", process.env.REACT_APP_JWT_TOKEN);

  let req_mercure;

  process.env.NODE_ENV === "production" ? (
  // skip port in production
  // hostname variable from Netlify
  // use https

    req_mercure = https.request({
      hostname: process.env.REACT_APP_MERCURE_HOSTNAME,
      path: "/.well-known/mercure",
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.REACT_APP_JWT_TOKEN,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      }
    },
    (res) => {
      console.log("Status: ", res.statusCode);
      console.log("Headers: ", JSON.stringify(res.headers));
    })

  ) : (
  // use port
  // hostname from .env
  // use http

    req_mercure = http.request({
      hostname: process.env.REACT_APP_MERCURE_HOSTNAME,
      port: "8998",
      path: "/.well-known/mercure",
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.REACT_APP_JWT_TOKEN,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      }
    },
    (res) => {
      console.log("Status: ", res.statusCode);
      console.log("Headers: ", JSON.stringify(res.headers));
    })
  );


  req_mercure.on("error", (err) => {
    console.error("An error occurred:", err.message);
  });


  req_mercure.write(postData);
  
  req_mercure.end();
};

module.exports = mercureTriggerUpdate;