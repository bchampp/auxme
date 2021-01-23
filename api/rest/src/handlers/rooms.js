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
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const createRoom = async (event) => {
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
        return response;
    }

    if (data.creatorId == null) {
        const response = {
            statusCode: 400,
            body: 'Field creatorId is missing in the request.'
        };
        return response;
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
    return response;
};

export const getRoom = async (event) => {
  
    const params = {
      TableName: ROOM_TABLE,
      Key: {
        roomId: event.pathParameters.id
      }
    };
  
    const result = await dynamo.get(params).promise();
  
    if (!result.Item) {
      const response = {
        statusCode: 404,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          message: "Room doesn't exist!",
        },
        null,
        2)
      };
      return response;
    }
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        message: 'Room data grabbed successfully',
        data: result.Item
      },
      null,
      2)
    };
    return response;
};

// TODO: Implement getRooms/{userId}