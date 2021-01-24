const AWS = require("aws-sdk");
import { v4 } from "uuid";

let dynamo = new AWS.DynamoDB.DocumentClient();

const USERS_TABLE = "UsersTable";

export const createUser = async (event) => {
  const data = JSON.parse(event.body);

  // TODO: This should be coming from iam_role authentication
  const userId = 1;

  if (!data) {
    const response = {
      statusCode: 400, 
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "Body missing in the request.",
    };
    return response;
  }

  if (!data.userId) {
    const response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "cognitoUserId in the request.",
    };
    return response;
  }
  if (!data.nickname) {
    const response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: "nickname in the request.",
    };
    return response;
  }


  const newUser = {
    userId: data.userId,
    nickname: data.nickname,
    rooms: [],
    refreshToken: ""
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
      const response = {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(
          {
            message: "Could not create user",
          },
          null,
          2
        ),
      };
      return response;
    
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
  //TODO: Add logic for updating user room list + eventually profile info
  const data = JSON.parse(event.body);
  const getCurrentRoomsParam = {
    TableName: USERS_TABLE,
    Key: {
      "userId": data.userId
    },
    ProjectionExpression: "rooms"
  }
  const currentRoomList = await dynamo.get(getCurrentRoomsParam).promise();
  if (!result) {
    const response = {
      statusCode: 404,
      headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        message: "User does not exist!",
      },
      null,
      2)
    };
    return response;
  }

  const roomList = result.Item.serialize();
  console.log(roomList);
  roomList.append(event.pathParameters.roomId);

  const params = {
    TableName:USERS_TABLE,
    Key: {
        "userId": event.pathParameters.userId,
    },
    UpdateExpression: "set rooms = :r",
    ExpressionAttributeValues:{
        ":r":roomList,
    },
    ReturnValues:"UPDATED_NEW"
  }  

  const addRoomResult = await dynamo.update(params).promise();
  if (!addRoomResult.Item) {
    const response = {
      statusCode: 404,
      headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        message: "Room add request failed!",
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
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      {
        message: "Room added successfully! redirecting",
        data: event.pathParameters.roomId,
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
