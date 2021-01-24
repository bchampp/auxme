const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();
import { generateRandomString } from '../utils/id';
import { createNewQueue } from './queue';

const ROOM_TABLE = "RoomsTable";

/**
 * Method to create a new room. 
 * Requires a roomName.
 * 
 * @param {request} event 
 */
export const createRoom = async (event) => {
    const data = JSON.parse(event.body);

    /**
     * Body: { roomName: "Some room name", userId: "Creator of the room"}
     */
    if (!data) {
        const response = {
            statusCode: 400,
            body: 'Body missing in the request.'
        };
        callback(null, response);
    }

    // Validate body
    if (!data.roomName) {
        const response = {
            statusCode: 400,
            body: 'Field roomName is missing in the request.'
        };
        return response;
    }

    if (!data.userId) {
      const response = {
        statusCode: 400,
        body: 'Field userId is missing in the request.'
    };
    return response;
    }

    const id = generateRandomString(5);

    const queueId = createNewQueue(id); // Generate new queue in table

    const room = {
        roomId: id,
        queueId: queueId,
        name: data.roomName,
        creator: data.userId,
        admins: [...data.userId] // Store creator as first admin
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

/**
 * Method to join an existing room
 * Requires the roomId as path variable.
 * 
 * @param {request} event 
 */
export const joinRoom = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      {
        message: "Succesfully joined room!",
        data: {},
      },
      null,
      2
    ),
  };
  return response;
};

/**
 * Method to get a rooms information.
 * Requires the roomId as path variable.
 * 
 * @param {request} event 
 */
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

/**
 * Method to get all rooms associated with a user.
 * 
 * @param {request} event 
 */
export const getRooms = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      message: 'Fetched all rooms succesfully!',
    },
    null,
    2)
  };
  return response;
}

/**
 * Method to delete a room and its associated queue.
 * Requires the roomId as path variable.
 * @param {*} event 
 */
export const deleteRoom = async (event) => {
  const roomId = event.pathParameters.id
  const params = {
    TableName: ROOM_TABLE,
    Key: { roomId }
  };

  await dynamo.delete(params).promise()
    .catch(err => {
      console.log(err);
    })

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({
      message: 'Deleted room succesfully!',
    },
    null,
    2)
  };
  return response;
}
