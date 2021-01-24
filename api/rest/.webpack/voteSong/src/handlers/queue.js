(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/handlers/queue.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/handlers/queue.js":
/*!*******************************!*\
  !*** ./src/handlers/queue.js ***!
  \*******************************/
/*! exports provided: createNewQueue, add, get, remove, vote */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createNewQueue\", function() { return createNewQueue; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"add\", function() { return add; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"get\", function() { return get; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"remove\", function() { return remove; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"vote\", function() { return vote; });\n/* harmony import */ var _utils_id__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/id */ \"./src/utils/id.js\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! uuid */ \"uuid\");\n/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(uuid__WEBPACK_IMPORTED_MODULE_1__);\n\r\n\r\nconst AWS = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\r\nlet dynamo = new AWS.DynamoDB.DocumentClient();\r\n\r\n\r\nconst CORS_HEADERS = {\r\n  \"Access-Control-Allow-Origin\": \"*\",\r\n  \"Access-Control-Allow-Credentials\": true,\r\n};\r\n\r\n/**\r\n * Utility function for creating a new queue\r\n * @param  roomId\r\n */\r\nconst createNewQueue = async (roomId) => {\r\n  const queueId = Object(uuid__WEBPACK_IMPORTED_MODULE_1__[\"v4\"])();\r\n  const queue = {\r\n    queueId,\r\n    roomId,\r\n    songs: [],\r\n  };\r\n\r\n  const params = {\r\n    TableName: process.env.QUEUE_TABLE,\r\n    Item: queue,\r\n  };\r\n\r\n  await dynamo.put(params).promise();\r\n  return queueId;\r\n};\r\n\r\n/**\r\n * Add a song to the queue\r\n * @param {*} event\r\n */\r\nconst add = async (event) => {\r\n  const data = JSON.parse(event.body);\r\n  //TODO: Check if song exists\r\n  if (!data) {\r\n    const response = {\r\n      statusCode: 400,\r\n      headers: CORS_HEADERS,\r\n      body: \"body missing in the request.\",\r\n    };\r\n    return response;\r\n  }\r\n  if (!data.queueId) {\r\n    const response = {\r\n      statusCode: 400,\r\n      headers: CORS_HEADERS,\r\n      body: \"room id missing in the request.\",\r\n    };\r\n    return response;\r\n  }\r\n  if (!data.songId) {\r\n    const response = {\r\n      statusCode: 400,\r\n      headers: CORS_HEADERS,\r\n      body: \"songId missing in the request.\"\r\n    };\r\n    return response;\r\n  }\r\n  const getQueueParam = {\r\n    TableName: process.env.QUEUE_TABLE,\r\n    Key: {\r\n      queueId: data.queueId\r\n    },\r\n    projectionExpression: \"songs\"\r\n  }\r\n\r\n  const currentQueue = await dynamo.get(getQueueParam).promise();\r\n  console.log(currentQueue);\r\n  const newQueue = currentQueue.Item.songs;\r\n  newQueue.push({ songId: data.songId, votes: 0 });\r\n\r\n\r\n  const patchTableParam = {\r\n    TableName: process.env.QUEUE_TABLE,\r\n    Key: {\r\n        queueId: data.queueId,\r\n    },\r\n    UpdateExpression: \"SET songs = :r\",\r\n    ExpressionAttributeValues:{\r\n        \":r\":newQueue\r\n    },\r\n    ReturnValues:\"UPDATED_NEW\"\r\n  }  \r\n  \r\n  const result = await dynamo.update(patchTableParam).promise();\r\n  console.log(result);\r\n\r\n  const response = {\r\n    statusCode: 200,\r\n    headers: {\r\n      \"Access-Control-Allow-Origin\": \"*\",\r\n      \"Access-Control-Allow-Credentials\": true,\r\n    },\r\n    body: JSON.stringify(\r\n      {\r\n        message: \"Succesfully added song to the queue!\",\r\n      },\r\n      null,\r\n      2\r\n    ),\r\n  };\r\n  return response;\r\n};\r\n\r\nconst get = async (event) => {\r\n  if (!event.pathParameters) {\r\n    const response = {\r\n      statusCode: 400,\r\n      headers: CORS_HEADERS,\r\n      body: \"body missing in the request.\",\r\n    };\r\n    return response;\r\n  }\r\n\r\n  const queueId = event.pathParameters.id;\r\n\r\n  const params = {\r\n    TableName: process.env.QUEUE_TABLE,\r\n    Key: { queueId }\r\n  }\r\n\r\n  const res = await dynamo.get(params).promise();\r\n  console.log(res);\r\n  \r\n  const response = {\r\n    statusCode: 200,\r\n    headers: CORS_HEADERS,\r\n    body: {\r\n      message: \"Success\",\r\n      items: res.Item.songs\r\n    }\r\n  };\r\n  return response;\r\n}\r\n/**\r\n * Remove a song from the queue\r\n * @param {*} event\r\n */\r\nconst remove = async (event) => {\r\n  const response = {\r\n    statusCode: 200,\r\n    headers: {\r\n      \"Access-Control-Allow-Origin\": \"*\",\r\n      \"Access-Control-Allow-Credentials\": true,\r\n    },\r\n    body: JSON.stringify(\r\n      {\r\n        message: \"Succesfully removed a song from the queue!\",\r\n      },\r\n      null,\r\n      2\r\n    ),\r\n  };\r\n  return response;\r\n};\r\n\r\nconst vote = async (event) => {\r\n  const data = JSON.parse(event.body);\r\n\r\n  if (!data) {\r\n    const response = {\r\n      statusCode: 400,\r\n      headers: CORS_HEADERS,\r\n      body: \"room id missing in the request.\",\r\n    };\r\n    return response;\r\n  }\r\n  if (!data.queueId) {\r\n    const response = {\r\n      statusCode: 400,\r\n      headers: CORS_HEADERS,\r\n      body: \"room id missing in the request.\",\r\n    };\r\n    return response;\r\n  }\r\n  if (!data.songId) {\r\n    const response = {\r\n      statusCode: 400,\r\n      headers: CORS_HEADERS,\r\n      body: \"songId missing in the request.\"\r\n    };\r\n    return response;\r\n  }\r\n  if (!data.voteValue) {\r\n    const response = {\r\n      statusCode: 400,\r\n      headers: CORS_HEADERS,\r\n      body: \"vote value missing in the request.\",\r\n    };\r\n    return response;\r\n\r\n  }\r\n  const getQueueParam = {\r\n    TableName: process.env.QUEUE_TABLE,\r\n    Key: {\r\n      queueId: data.queueId\r\n    },\r\n    projectionExpression: \"songs\"\r\n  }\r\n\r\n  const currentQueue = await dynamo.get(getQueueParam).promise();\r\n  const newQueue = currentQueue.Item.songs;\r\n  console.log(newQueue);\r\n\r\n  for (var i = 0; i < newQueue.length; i++) {\r\n    if(newQueue[i].songId == data.songId) {\r\n      newQueue[i].votes = newQueue[i].votes + data.voteValue;\r\n    }\r\n  }\r\n\r\n  const queueVotePatchParams = {\r\n    TableName: process.env.QUEUE_TABLE,\r\n    Key: {\r\n      queueId: data.queueId\r\n    },\r\n    UpdateExpression: \"SET songs = :r\",\r\n    ExpressionAttributeValues:{\r\n        \":r\":newQueue\r\n    },\r\n    ReturnValues:\"UPDATED_NEW\"\r\n  }\r\n\r\n  const result = await dynamo.update(queueVotePatchParams).promise();\r\n  console.log(result);\r\n\r\n  const response = {\r\n    statusCode: 200,\r\n    headers: {\r\n      \"Access-Control-Allow-Origin\": \"*\",\r\n      \"Access-Control-Allow-Credentials\": true,\r\n    },\r\n    body: JSON.stringify(\r\n      {\r\n        message: \"Succesfully Voted!\",\r\n      },\r\n      null,\r\n      2\r\n    ),\r\n  };\r\n  return response;\r\n};\r\n\n\n//# sourceURL=webpack:///./src/handlers/queue.js?");

/***/ }),

/***/ "./src/utils/id.js":
/*!*************************!*\
  !*** ./src/utils/id.js ***!
  \*************************/
/*! exports provided: generateRandomString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"generateRandomString\", function() { return generateRandomString; });\n/**\r\n * Generates a random string containing numbers and letters\r\n * @param  {number} length The length of the string\r\n * @return {string} The generated string\r\n */\r\nconst generateRandomString = length => {\r\n    var text = '';\r\n    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';\r\n  \r\n    for (var i = 0; i < length; i++) {\r\n      text += possible.charAt(Math.floor(Math.random() * possible.length));\r\n    }\r\n    return text;\r\n  };\n\n//# sourceURL=webpack:///./src/utils/id.js?");

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"aws-sdk\");\n\n//# sourceURL=webpack:///external_%22aws-sdk%22?");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"uuid\");\n\n//# sourceURL=webpack:///external_%22uuid%22?");

/***/ })

/******/ })));