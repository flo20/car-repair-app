const uuid = require("uuid");
const docClient = require("./aws-config");
const mercureTriggerUpdate = require("../helpers/mercure");


// Mercure testing - send a message with a random string
const mercureTestMsg = (req, res) => {
  let random_generated_string = Math.random().toString(36).substring(7);
  
  mercureTriggerUpdate("/hello-world", random_generated_string);

  res.end("Hello world feat. " + random_generated_string);
};


// save new message to a specific chat
const postChat = function(req, res) {
  const message = {
    "messageId": uuid.v4(),
    "name": req.body.name,
    "text": req.body.text,
    "chatroom": req.body.chatroom, // that is the same as bookingId the chat is about
    "time": new Date().getTime().toString()
  };
  
  const params = {
    TableName: "Chat",
    Item: message
  };
  
  docClient.put(params, function(err, data) {
    if (err) {
      res.json({ "error": err, "data": data });
    } else {
      res.json({ "error": false, "data": params.Item });

      // if saving new message successful, trigger Mercure update to everyone who's subscribed to the topic of this chatroom
      const topic = `/booking-chat/${req.body.chatroom}`;
      mercureTriggerUpdate(topic, message);

      res.end();
    }
  });
};

// // get messages from specific chat room
function getChat(req, res) {
  const chatroom = req.params.chatroom; // that is the same as bookingId the chat is about

  const params = {
    TableName: "Chat",
    IndexName: "chatroom_time_idx",
    // Limit: req.params.limit || 20, 
    ScanIndexForward: true,
    KeyConditionExpression: "chatroom = :chatroom",
    ExpressionAttributeValues: {
      ":chatroom": chatroom
    }
  };

  docClient.query(params, function(err, data) {
    if (err) {
      res.json({ "error": err, "data": data });
    } else {
      res.json({ "error": false, "data": data.Items });
    }
  });
}

// delete messages from specific chat room
function deleteChat(req, res) {
  const chatroom = req.params.chatroom; // that is the same as bookingId the chat is about
  console.log("Delete specific chatroom", chatroom);

  // get all messages of a specific chatroom to get their messageIds
  const params = {
    TableName: "Chat",
    IndexName: "chatroom_time_idx",
    ScanIndexForward: true,
    KeyConditionExpression: "chatroom = :chatroom",
    ExpressionAttributeValues: {
      ":chatroom": chatroom
    }
  };

  docClient.query(params, function(err, data) {
    if (err) {
      res.json({ "error": err, "data": data });
    } else {
      // data.Items is an array of messages
      console.log("messages of the chatroom", data.Items);
      // for every message, create DeleteRequest
      const deleteRequestArray = data.Items.map(message => {
        return {
          "DeleteRequest": { 
            "Key": { 
              "messageId" : message.messageId
            }
          }
        };
      }
      );
      const params = {
        RequestItems: {
          "Chat": deleteRequestArray
        }
      };

      docClient.batchWrite(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });
    }
  });
}

 
module.exports = { mercureTestMsg, postChat, getChat, deleteChat };
