const express = require("express");
const serverless = require("serverless-http");
const app = express();
const router = express.Router();

require("../../backend/routes")(app, router, "/.netlify/functions/api");

module.exports.handler = serverless(app);