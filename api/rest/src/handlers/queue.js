const AWS = require('aws-sdk');
let dynamo = new AWS.DynamoDB.DocumentClient();

const QUEUE_TABLE = "QueueTable";

/**
 * QueueTable: [
 *  { "songs": [
 *      { "id": "SPOTIFY_SONG_ID", votes: 0}
 *      ]
 *  }
 * ]
 */

/**
 * Utility function for creating a new queue
 * @param  roomId 
 */
export const createNewQueue = (roomId) => {

}

/**
 * Add a song to the queue
 * @param {*} event 
 */
export const add = async (event) => {
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
}

export const vote = async (event) => {
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
}