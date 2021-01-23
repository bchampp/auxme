'use strict';
const fetch = require('node-fetch');
const FormData = require('form-data');
const https = require('https');
const request = require('request');
const util = require('util');
const formurlencoded = require('form-urlencoded').default;
const querystring = require('querystring');
const client_id = "359de0c1b4284c0294a710c41c139bba";
const client_secret = "815f0c15f85148c991ee55c006743590";
const scope = 'user-read-private user-read-email user-modify-playback-state user-read-playback-state';
const redirect_uri = 'https://ka45vpf7sg.execute-api.ca-central-1.amazonaws.com/dev/callback'
const stateKey = 'spotify_auth_state';

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

module.exports.search = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: '',
          input: event,
        },
        null,
        2
      )
    }
};
module.exports.play = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: '',
          input: event,
        },
        null,
        2
      )
    }
};
module.exports.playsong = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: '',
          input: event,
        },
        null,
        2
      )
    }
};
module.exports.playsongnext = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: '',
          input: event,
        },
        null,
        2
      )
    }
};
module.exports.getdevices = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: '',
          input: event,
        },
        null,
        2
      )
    }
};
module.exports.setdevice = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: '',
          input: event,
        },
        null,
        2
      )
    }
};
module.exports.spotifylogin = async (event, context, callback) => {
  Promise.resolve(event)
  .then(() => {
    var state = generateRandomString(16);
    let url = 'https://accounts.spotify.com/authorize?'+
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    });
    console.log(url);
    return callback(null, {
      statusCode: 301,
      multiValueHeaders: {"Set-Cookie": [`${stateKey}=${state}`]},
      headers: {
        Location: url
      }
    });
  }).catch(callback);
};

module.exports.requesttest = async (event, context, callback) => {
  const options = {
    host: 'jsonplaceholder.typicode.com',
    port: 443,
    path: '/posts',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }
  
  const post = (payload) => new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let buffer = "";
      res.on('data', chunk => buffer += chunk);
      res.on('end', () => resolve(JSON.parse(buffer)));
    });
    req.on('error', e => reject(e.message));
    if (payload)
      req.write(JSON.stringify(payload));
    req.end();
  });
  
  const res = await post({
    title: 'foo',
    body: 'bar',
    userId: 1
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: res,
        input: event,
      },
      null,
      2
    )
  }
};

module.exports.callback = async (event, context, callback) => {
  const post = (options, payload) => new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let buffer = "";
      res.on('data', chunk => buffer += chunk);
      res.on('end', () => resolve(buffer));
    });
    req.on('error', e => reject(e.message));
    req.on('response', (res) => {
      console.log(res.statusCode);
    });
    if (payload)
      req.write(formurlencoded(payload));
    // payload.pipe(req);
    req.end();
  });
  
  let code = event.queryStringParameters.code || null;
  let state = event.queryStringParameters.state || null;
  
  let formData = {
    code: code,
    redirect_uri: redirect_uri,
    grant_type: 'authorization_code'
  };
  
  let headers = {
    'content-type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
  };
  var authOptions = {
    host: 'accounts.spotify.com',
    path: '/api/token',
    method: 'POST',
    port: 443,
    headers: headers
  };
  
  console.log(authOptions);
  console.log("Sending request");
  
  const res = await post(authOptions, formData);
  console.log(res);
  
  return callback(null, {
    statusCode: 200,
    multiValueHeaders: {"Set-Cookie": [`access_token=${res.access_token}`, `refresh_token=${res.refresh_token}`]},
    headers: {
      Location: 'localhost:3000'
    }
  });
};