const express = require("express");
const app = express();
const cors = require("cors");
const webPush = require("web-push");

require("dotenv").config();

const router = express.Router();
const port = process.env.PORT || 5001;

require("./routes")(app, router, "/");
app.use(cors());
app.use(express.json());

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails("mailto:florence.anipa@druid.com", publicVapidKey, privateVapidKey );

app.listen(port, function() {
  console.log("Backend API is now listening on http://localhost:" + port + " ...");
});