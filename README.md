# Car maintenance PWA

A Progressive Web App for car repair shops and their customers.

Made with React, [create-react-app](https://create-react-app.dev/docs/making-a-progressive-web-app/).

## Requirements

- Node 14 (use `nvm use`)
- AWS cli (install: `brew install awscli`)

## Local setup

Build the codebase:

```
$ nvm use
$ npm install
```

Start up DynamoDB and Mercure:

```
$ docker-compose up -d
```

Create bookings table to DynamoDB:

```
$ aws dynamodb create-table \
     --endpoint-url http://localhost:8989 \
     --table-name Bookings \
     --attribute-definitions AttributeName=bookingId,AttributeType=S AttributeName=shop,AttributeType=S AttributeName=date,AttributeType=S AttributeName=licence_number,AttributeType=S\
     --key-schema KeyType=HASH,AttributeName=bookingId \
     --global-secondary-indexes \
          'IndexName=licence_number_date_idx,KeySchema=[{AttributeName=licence_number,KeyType=HASH},{AttributeName=date,KeyType=RANGE}],ProvisionedThroughput={ReadCapacityUnits=1,WriteCapacityUnits=1},Projection={ProjectionType=ALL}' \
          'IndexName=shop_date_idx,KeySchema=[{AttributeName=shop,KeyType=HASH},{AttributeName=date,KeyType=RANGE}],ProvisionedThroughput={ReadCapacityUnits=1,WriteCapacityUnits=1},Projection={ProjectionType=ALL}' \
     --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1
```

Create chat table to DynamoDB:

```
$ aws dynamodb create-table \
         --endpoint-url http://localhost:8989 \
         --table-name Chat \
         --attribute-definitions AttributeName=messageId,AttributeType=S AttributeName=name,AttributeType=S AttributeName=time,AttributeType=S AttributeName=chatroom,AttributeType=S \
         --key-schema KeyType=HASH,AttributeName=messageId \
         --global-secondary-indexes \
               'IndexName=chatroom_time_idx,KeySchema=[{AttributeName=chatroom,KeyType=HASH},{AttributeName=time,KeyType=RANGE}],ProvisionedThroughput={ReadCapacityUnits=1,WriteCapacityUnits=1},Projection={ProjectionType=ALL}' \
               'IndexName=name_time_idx,KeySchema=[{AttributeName=name,KeyType=HASH},{AttributeName=time,KeyType=RANGE}],ProvisionedThroughput={ReadCapacityUnits=1,WriteCapacityUnits=1},Projection={ProjectionType=ALL}' \
         --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1


```
List tables in DynamoDB:
```
$ aws dynamodb list-tables --endpoint-url http://localhost:8989
```

Delete a table in DynamoDB:
```
$ aws dynamodb delete-table --table-name Tablenamehere --endpoint-url http://localhost:8989
```

Start up the local backend:
```
$ node backend/server-local.js
```

Backend should be now running. It can be tested with accessing http://localhost:5001

Open up another terminal and start the app:

```
$ npm run start
```

App opens in http://localhost:3000

## Mercure

Open Mercure in http://localhost:8998/.well-known/mercure/ui/

## API endpoints

### Chat

`POST` /chat_post_msg

- `name`: User's name or nick
- `text`: The message to be added to chat
- `chatroom`: uuid of existing discussion (the same as the bookingId of the booking the discussion is about)

`GET` /chat/:chatroom

- `chatroom`: uuid of existing discussion (the same as the bookingId of the booking the discussion is about)

### Bookings

`POST` /booking
- `apptStatus`: Status of the booking
- `shop`: Name of repair shop
- `date`: Date of appointment
- `time`: Time of appointment
- `year`: Production year of vehicle
- `name`: Name of vehicle owner
- `email`: Email address of vehicle owner
- `phone`: Phone number of vehicle owner
- `brand`: Brand of vehicle 
- `model`: Model of vehicle 
- `mileage`: Vehicle mileage
- `image`: Image attachment
- `details`: Additional information about the vehicle
- `licence_number`: Vehicle licence plates number
- `pickup_time`: Estimated pickup time
- `pickup_date`: Estimated pickup date
- `subscription`: Subscription to push notifications 


`GET` /bookings/id/:bookingId

- `bookingId`: uuid of the searched booking

`GET` /all-bookings
- Fetch all existing bookings

`PATCH` /update-booking/:updateValues
- `updateValues`: "apptStatus" | "estimatedPickup" | "estimatedPrice" : name of the information being updated
- `bookingId`: uuid of the booking to be updated
- `update`: New status of the booking | New estimated pickup time and date (object with keys pickup_time and pickup_date) | New estimated price

`PATCH` /update-availability
- `bookingId`: uuid of the booking to be updated
- `pickup_time`: Updated estimated pickup time
- `pickup_date`: Updated estimated pickup date

