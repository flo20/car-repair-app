const AWS = require("aws-sdk");

const AWSlocal = {
  region: "eu-central-1",
  endpoint: "http://localhost:8989"
};

const AWSprod = {
  // production/remote Dynamo settings
  // keep this SECRET, use env variables!
  accessKeyId: process.env.AMAZON_ACCESS_KEY_ID,
  secretAccessKey: process.env.AMAZON_SECRET_ACCESS_KEY,
  region: process.env.AMAZON_REGION,
};

let configuration;

process.env.NODE_ENV === "production" ? 
  configuration = AWSprod :
  configuration = AWSlocal;

AWS.config.update(configuration);
    
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = docClient;