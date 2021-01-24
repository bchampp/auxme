const AWS = require("aws-sdk");
import { v4 } from "uuid";

let dynamo = new AWS.DynamoDB.DocumentClient();

const USER_TABLE = "UsersTable";

export const createUser = async (event) => {
  const data = JSON.parse(event.body);

  // TODO: This should be coming from iam_role authentication
  const userId = 1;

  if (!data) {
    const response = {
      statusCode: 400,
      body: "Body missing in the request.",
    };
    callback(null, response);
  }

  const auxmeUserId = v4();

  const newUser = {
    userId,
    auxmeUserId,
    nickname: data.nickname,
    rooms: [],
  };

  const params = {
    TableName: USERS_TABLE,
    Item: newUser,
  };

  await dynamo
    .put(params)
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
        message: "User succesfully created!",
        userId: auxmeUserId,
      },
      null,
      2
    ),
  };
  return response;
};

export const getUser = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(
          {
            message: "Succesfully retrieved user from DB",
            userId: 1,
          },
          null,
          2
        ),
      };
      return response;
}

export const updateUser = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(
          {
            message: "Succesfully updated user from DB",
            data: {},
          },
          null,
          2
        ),
      };
      return response;
};

export const deleteUser = async (event) => {
    const params = {
        TableName: USERS_TABLE,
        Key: { userId }
    }

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
      message: 'Deleted user succesfully!',
    },
    null,
    2)
  };
  return response;
};
