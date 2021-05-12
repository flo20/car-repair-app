const uuid = require("uuid");
const docClient = require("./aws-config");
const mercureTriggerUpdate = require("../helpers/mercure");

// save booking data
function postBooking (req, res) {
  const  {apptStatus, shop, date, time, name, email, phone, brand, model, mileage, image, details, licence_number, year, price, pickup_time, pickup_date, subscription} = req.body;
  const params = {
    TableName: "Bookings",
    Item: 
        { 
          "apptStatus": apptStatus,
          "bookingId": uuid.v4(),
          "shop": shop,
          "date": date,
          "time": time,
          "year": year,
          "name": name,
          "email": email,
          "phone": phone,
          "brand": brand,
          "model": model,
          "mileage": mileage,
          "image": image,
          "details": details,
          "price" : price,
          "licence_number": licence_number,
          "pickup_time": pickup_time,
          "pickup_date": pickup_date,
          "subscription": subscription, 
        }
  };
  
  docClient.put(params, function(err, data) {
    if (err) {
      res.json({ "error": err, "data": data, "message": "Your data has already been saved."});
      console.log("Your data has already been saved.");
    } 
    else {
      res.json({ "error": false, "data": params.Item, "message": "Your data has been saved." });
      console.log("Yay post");
      // trigger Mercure update so that Admin gets refreshed data
      const topic = "/update-bookings-list";
      const message = {booking: params.Item, type: "new-booking"};
      mercureTriggerUpdate(topic, message);
    }
  });
}

// get all bookings
function getAllBookingData (req, res) {
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

// get booking data with booking ID
function getBookingById (req, res) {
  const bookingId = req.params.bookingId;
  const params = {
    TableName: "Bookings",
    Key: { "bookingId": bookingId }
  };

  docClient.get(params, function(err, data) {
    if (err) {
      res.json({ "error": err, "data": data });
    } else {
      res.json({ "error": false, "data": data.Item });
    }
  });
}


// delete booking data with booking ID
function deleteBooking (req, res) {
  const bookingId = req.params.bookingId;
  const params = {
    TableName: "Bookings",
    Key: { "bookingId": bookingId }
  };

  docClient.delete(params, function(err, data) {
    if (err) {
      res.json({ "error": err, "data": data });
      console.log("Could not delete bookings");
    } else {
      res.json({ "error": false, "data": data.Item });
      console.log("Deleted bookings");
    }
  });
}

// updating all booking info by admin 
function updateBooking (req, res) {
  const updateValues = req.params.updateValues;
  let updateExpression, expressionAttributeValues, mercureMessage;
  // updating appointment status
  if (updateValues === "apptStatus") {
    updateExpression = "set apptStatus = :x";
    expressionAttributeValues = {
      ":x": req.body.update,
    };
    mercureMessage = {
      updatedStatus: req.body.update, 
      type: "status-update"};
  }

  // updating estimated date and time
  if (updateValues === "estimatedPickup") {
    updateExpression = "set pickup_time = :t, pickup_date = :d";
    expressionAttributeValues = {
      ":t": req.body.update.pickup_time,
      ":d": req.body.update.pickup_date
    };
    mercureMessage = {
      updatedPickup: {
        time: req.body.update.pickup_time,
        date: req.body.update.pickup_date
      }, 
      type: "pickup-time-update"
    };
  }
  // updating estimated date and time
  if (updateValues === "estimatedPrice") {
    updateExpression = "set price = :p";
    expressionAttributeValues = {
      ":p": req.body.price,
    };
    mercureMessage = {
      price: req.body.price,
      type: "estimated-price-update"
    };
  }

  const params = {
    TableName: "Bookings",
    Key: { bookingId: req.body.bookingId },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "UPDATED_NEW" 
  };

  docClient.update(params, function(err, data) {
    if (err) {
      res.json({ "error": err, "data": data });
      console.log("unable to edit this");
    } else {
      res.json({ "error": false, "data": data.Attributes });
      console.log("Successfully edited");

      // after successful update, send a Mercure update to the user of that booking (progress page)
      // message set earlier based on what attribute is being updated
      const topic = `/booking-update/${req.body.bookingId}`;
      mercureTriggerUpdate(topic, mercureMessage);
    }
  });
}

 
module.exports = 
{ 
  postBooking, 
  getBookingById,
  getAllBookingData, 
  updateBooking, 
  deleteBooking
};
