const AWS = require("aws-sdk");
import { v4 } from "uuid";

let dynamo = new AWS.DynamoDB.DocumentClient();

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
    refreshToken: "",
  };

  const params = {
    TableName: process.env.USERS_TABLE,
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
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      userId: event.pathParameters.id,
    },
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

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      {
        message: "Succesfully retrieved user from DB",
        data: {
          numRooms: result.Item.rooms.length,
          nickname: result.Item.nickname
        },
      },
      null,
      2
    ),
  };
  return response;
};

export const deleteUser = async (event) => {
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: { userId },
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
        message: "Deleted user succesfully!",
      },
      null,
      2
    ),
  };
  return response;
};

export const setUserTokens = async (event) => {
  console.log(event.body);
  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      userId: event.body.id
    },
    UpdateExpression: "SET refreshToken = :r",
    ExpressionAttributeValues: {
      ":r": event.body.refreshToken,
    },
    ReturnValues: "UPDATED_NEW",
  }
  
  const result = await dynamo.update(params).promise();
  console.log(result);
  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(
      {
        message: "Succesfully added spotify tokens to user!",
        data: {},
      },
      null,
      2
    ),
  };
  return response;
}

export const saveRoomToUser = async (roomId, userId) => {
  //TODO: Add logic for updating user room list + eventually profile info
  const getCurrentRoomsParam = {
    TableName: process.env.USERS_TABLE,
    Key: { 
      userId : userId,
    },
    ProjectionExpression: "rooms",
  };

  const currentRoomList = await dynamo.get(getCurrentRoomsParam).promise();
  if(currentRoomList.Item && currentRoomList.Item.rooms) {

    const newRoomList = currentRoomList.Item.rooms;
    for (var i = 0; i < newRoomList.length; i++) {
      if (newRoomList[i] == roomId) {
        console.log("caught");
        const response = {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
  
          },
          body: JSON.stringify(
            {
              message: "Already in room!",
              data: {},
            },
            null,
            2
          ),
        }
        return response;
      }
    }
    console.log(newRoomList);

    newRoomList.push(roomId);
    const patchTableParam = {
      TableName: process.env.USERS_TABLE,
      Key: {
        userId: userId,
      },
      UpdateExpression: "SET rooms = :r",
      ExpressionAttributeValues: {
        ":r": newRoomList,
      },
      ReturnValues: "UPDATED_NEW",
    };
  
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
          message: "Succesfully joined room!",
          data: {},
        },
        null,
        2
      ),
    };
    return response;
  }

  else if (!currentRoomList.Items || !currentRoomList.Items.rooms) {
    const newRoomList = [];

    newRoomList.push(roomId);
  
    const patchTableParam = {
      TableName: process.env.USERS_TABLE,
      Key: {
        userId: userId,
      },
      UpdateExpression: "SET rooms = :r",
      ExpressionAttributeValues: {
        ":r": newRoomList,
      },
      ReturnValues: "UPDATED_NEW",
    };
  
    console.log("caught");

    const result = await dynamo.update(patchTableParam).promise();
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
  }
  const newRoomList = currentRoomList.Item.rooms;

  newRoomList.push(roomId);
  console.log("caught");
  const patchTableParam = {
    TableName: process.env.USERS_TABLE,
    Key: {
      userId: userId,
    },
    UpdateExpression: "SET rooms = :r",
    ExpressionAttributeValues: {
      ":r": newRoomList,
    },
    ReturnValues: "UPDATED_NEW",
  };

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
        message: "Succesfully joined room!",
        data: {},
      },
      null,
      2
    ),
  };
  return response;
};

// const roomList = JSON.parse(result.Item);
// console.log(roomList);
// roomList.append(event.pathParameters.roomId);

// const params = {
//   TableName: process.env.USERS_TABLE,
//   Key: {
//       userId: event.pathParameters.userId,
//   },
//   UpdateExpression: "set rooms = :r",
//   ExpressionAttributeValues:{
//       ":r":roomList,
//   },
//   ReturnValues:"UPDATED_NEW"
// }

// const addRoomResult = await dynamo.update(params).promise();
// if (!addRoomResult.Item) {
//   const response = {
//     statusCode: 404,
//     headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Credentials": true
//     },
//     body: JSON.stringify({
//       message: "Room add request failed!",
//     },
//     null,
//     2)
//   };
//   return response;
// }

// const response = {
//   statusCode: 200,
//   headers: {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Credentials": true,
//   },
//   body: JSON.stringify(
//     {
//       message: "Room added successfully! redirecting",
//       data: event.pathParameters.roomId,
//     },
//     null,
//     2
//   ),
// };
// return response;
