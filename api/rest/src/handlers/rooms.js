const AWS = require("aws-sdk");
let dynamo = new AWS.DynamoDB.DocumentClient();
import { generateRandomString } from "../utils/id";
import { createNewQueue } from "./queue";
import { saveRoomToUser } from "./users";

// TODO: Add number of users to rooms.js
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

//TODO: queueid is empty
//TODO: users table, roomid not being added
/**
 * Method to create a new room.
 * Requires a roomName.
 *
 * @param {request} event
 */
export const createRoom = async (event) => {
  const data = JSON.parse(event.body);

  if (!data) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "Body missing in the request."
    };
    return response;
  }

  // Validate body
  if (!data.roomName) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "Field roomName is missing in the request."
    };
    return response;
  }

  if (!data.userId) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "Field userId is missing in the request.",
    };
    return response;
  }

  const roomId = generateRandomString(5);
  const queueId = await createNewQueue(roomId); // Generate new queue in table
  saveRoomToUser(roomId, data.userId);
  console.log(queueId);
  // TODO: Should update rooms in user table
  const admins = [];
  admins.push(data.userId);

  const room = {
    roomId: roomId,
    queueId: queueId,
    name: data.roomName,
    creator: data.userId,
    admins: admins, // Store creator as first admin
  };

  const params = {
    TableName: process.env.ROOMS_TABLE,
    Item: room,
  };

  await dynamo.put(params).promise();

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      {
        message: "Room created succesfully!",
        roomCode: roomId,
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
  const data = JSON.parse(event.body);
  if (!data) {
    const response = {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(
        {
          message: "Body missing!",
          data: {},
        },
        null,
        2
      ),
    };
    return response;
  }
  if (!data.roomId) {
    const response = {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(
        {
          message: "Body missing!",
          data: {},
        },
        null,
        2
      ),
    };
    return response;
  }
  if (!data.userId) {
    const response = {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(
        {
          message: "User Id missing!",
          data: {},
        },
        null,
        2
      ),
    };
    return response;
  }
  await saveRoomToUser(data.roomId, data.userId);
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      {
        message: "Successfully added user to room.",
        data: {},
      },
      null,
      2
    ),
  };
  return response;
}

/**
 * Method to get a rooms information.
 * Requires the roomId as path variable.
 *
 * @param {request} event
 */
export const getRoom = async (event) => {
  const params = {
    TableName: process.env.ROOMS_TABLE,
    Key: {
      roomId: event.pathParameters.id,
    },
  };

  const result = await dynamo.get(params).promise();

  if (!result.Item) {
    const response = {
      statusCode: 404,
      headers: CORS_HEADERS,
      body: JSON.stringify(
        {
          message: "Room doesn't exist!",
        },
        null,
        2
      ),
    };
    return response;
  }

  const response = {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(
      {
        message: "Room data grabbed successfully",
        data: result.Item,
      },
      null,
      2
    ),
  };
  
  return response;
};

const getRoomInfo = async (roomId) => {
  const params = {
    TableName: process.env.ROOMS_TABLE,
    Key: { roomId },
  };

  const result = await dynamo.get(params).promise();
  if (!result.Item) {
    return null;
  } else { 
    return result.Item;
  }
}

export const addToQueue = async (event) => {
  const data = JSON.parse(event.body);
  if (!data) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "body missing in the request.",
    };
    return response;
  }
  if (!data.roomId) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "room id in the request.",
    };
    return response;
  }
  if (!data) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "body missing in the request.",
    };
    return response;
  }


}

/**
 * Method to get all rooms associated with a user.
 *
 * @param {request} event
 */
export const getRooms = async (event) => {
  const userId = event.pathParameters.id;

  if (!userId) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "userId missing in the request.",
    };
    return response;
  }

  const params = {
    TableName: process.env.USERS_TABLE,
    Key: { userId },
  };

  const result = await dynamo.get(params).promise();

  if (!result.Item) {
    const response = {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(
        {
          message: "Provided user does not exist in the DB",
        },
        null,
        2
      ),
    };
    return response;
  }

  const allRoomInfo = [];
  const rooms = result.Item.rooms;
  for(const room of rooms) {
    const info = await getRoomInfo(room);
    allRoomInfo.push(info);
  }

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      {
        message: "Fetched all rooms succesfully!",
        items: allRoomInfo
      },
      null,
      2
    ),
  };
  return response;
};

/**
 * Method to delete a room and its associated queue.
 * Requires the roomId as path variable.
 * @param {*} event
 */
export const deleteRoom = async (event) => {
  const roomId = event.pathParameters.id;
  const params = {
    TableName: process.env.ROOM_TABLE,
    Key: { roomId },
  };

  await dynamo
    .delete(params)
    .promise()
    .catch((err) => {
      console.log(err);
    });

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      {
        message: "Deleted room succesfully!",
      },
      null,
      2
    ),
  };
  return response;
};
