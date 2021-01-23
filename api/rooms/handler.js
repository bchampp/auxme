const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const ROOM_TABLE = "RoomsTable";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/**
 * Takes in a room name and the userId of the creator.
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 */
export const create = async (event, context, callback) => {
  const data = JSON.parse(event.body);

  if (!data) {
    const response = {
      statusCode: 400,
      body: 'Body missing in the request.'
    };
    callback(null, response);
  }

  // Validate body
  if (data.roomName == null) {
    const response = {
      statusCode: 400,
      body: 'Field roomName is missing in the request.'
    };
    callback(null, response);
  }

  if (data.creatorId == null) {
    const response = {
      statusCode: 400,
      body: 'Field creatorId is missing in the request.'
    };
    callback(null, response);
  }

  const id = generateRandomString(5);
  const room = {
    roomId: id,
    name: data.roomName,
    creator: data.creatorId,
  };

  const params = {
    TableName: ROOM_TABLE,
    Item: room
  };

  await dynamo.put(params).promise();

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(
      {
        message: 'Room created succesfully!',
        roomCode: id,
      },
      null,
      2
    ),
  };
  callback(null, response);
};

export const get = async (event, context, callback) => {
  console.log(event.pathParameters.id);

  const params = {
    TableName: ROOM_TABLE,
    Key: {
      roomId: event.pathParameters.id
    }
  };

  const result = await dynamo.get(params).promise();

  if (!result.Item) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: "Room doesn't exist!",
      },
      null,
      2)
    };
    callback(null, response);
  }
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      message: 'Room data grabbed successfully',
      roomData: result.Item
    },
    null,
    2)
  };
  callback(null, response);
};