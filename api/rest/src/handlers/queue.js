import { generateRandomString } from "../utils/id";

const AWS = require("aws-sdk");
let dynamo = new AWS.DynamoDB.DocumentClient();
import { v4 } from "uuid";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

/**
 * Utility function for creating a new queue
 * @param  roomId
 */
export const createNewQueue = async (roomId) => {
  const queueId = v4();
  const queue = {
    queueId,
    roomId,
    songs: [],
  };

  const params = {
    TableName: process.env.QUEUE_TABLE,
    Item: queue,
  };

  await dynamo.put(params).promise();
  return queueId;
};

/**
 * Add a song to the queue
 * @param {*} event
 */
export const add = async (event) => {
  const data = JSON.parse(event.body);
  //TODO: Check if song exists
  if (!data) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "body missing in the request.",
    };
    return response;
  }
  if (!data.queueId) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "room id missing in the request.",
    };
    return response;
  }
  if (!data.songId) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "songId missing in the request."
    };
    return response;
  }
  const getQueueParam = {
    TableName: process.env.QUEUE_TABLE,
    Key: {
      queueId: data.queueId
    },
    projectionExpression: "songs"
  }

  const currentQueue = await dynamo.get(getQueueParam).promise();
  console.log(currentQueue);
  const newQueue = currentQueue.Item.songs;
  newQueue.push({ songId: data.songId, votes: 0 });


  const patchTableParam = {
    TableName: process.env.QUEUE_TABLE,
    Key: {
        queueId: data.queueId,
    },
    UpdateExpression: "SET songs = :r",
    ExpressionAttributeValues:{
        ":r":newQueue
    },
    ReturnValues:"UPDATED_NEW"
  }  
  
  const result = await dynamo.update(patchTableParam).promise();
  console.log(result);

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      {
        message: "Succesfully added song to the queue!",
      },
      null,
      2
    ),
  };
  return response;
};

export const get = async (event) => {
  if (!event.pathParameters) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "body missing in the request.",
    };
    return response;
  }

  const queueId = event.pathParameters.id;

  const params = {
    TableName: process.env.QUEUE_TABLE,
    Key: { queueId }
  }

  const res = await dynamo.get(params).promise();
  console.log(res);
  
  const response = {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: {
      message: "Success",
      items: res.Item.songs
    }
  };
  return response;
}
/**
 * Remove a song from the queue
 * @param {*} event
 */
export const remove = async (event) => {
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      {
        message: "Succesfully removed a song from the queue!",
      },
      null,
      2
    ),
  };
  return response;
};

export const vote = async (event) => {
  const data = JSON.parse(event.body);

  if (!data) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "room id missing in the request.",
    };
    return response;
  }
  if (!data.queueId) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "room id missing in the request.",
    };
    return response;
  }
  if (!data.songId) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "songId missing in the request."
    };
    return response;
  }
  if (!data.voteValue) {
    const response = {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: "vote value missing in the request.",
    };
    return response;

  }
  const getQueueParam = {
    TableName: process.env.QUEUE_TABLE,
    Key: {
      queueId: data.queueId
    },
    projectionExpression: "songs"
  }

  const currentQueue = await dynamo.get(getQueueParam).promise();
  const newQueue = currentQueue.Item.songs;
  console.log(newQueue);

  for (var i = 0; i < newQueue.length; i++) {
    if(newQueue[i].songId == data.songId) {
      newQueue[i].votes = newQueue[i].votes + data.voteValue;
    }
  }

  const queueVotePatchParams = {
    TableName: process.env.QUEUE_TABLE,
    Key: {
      queueId: data.queueId
    },
    UpdateExpression: "SET songs = :r",
    ExpressionAttributeValues:{
        ":r":newQueue
    },
    ReturnValues:"UPDATED_NEW"
  }

  const result = await dynamo.update(queueVotePatchParams).promise();
  console.log(result);

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      {
        message: "Succesfully Voted!",
      },
      null,
      2
    ),
  };
  return response;
};
