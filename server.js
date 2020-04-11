// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START gae_node_request_example]
const express = require('express');
const bodyParser = require('body-parser');
const path = require(`path`);
const util = require(`util`);

const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
var counter = 0;
var roomlist = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/mainmenu.html'));
});

app.get('/getChatLog', (req, res) => {

});

app.post('/redirect', (req, res) => {
  let result = {};
  switch (req.body.action) {
    case "create":
      result = createRoom(req);
      break;
    case "join":
      result = joinRoom(req);
      break;
  }
  res.send(JSON.stringify(result));
})

function createRoom(req) {
  //create room
  let result = {};
  let room = [];
  room["owner"] = req.body.name;
  room["participant_list"] = [req.body.name];
  room["wolf_log"] = [];

  let roomID = makeid(5);
  while (typeof roomlist[roomID] != "undefined") {
    roomID = makeid(5);
  }
  roomlist[roomID] = room;
  result.message = `Room created! Room ID: ${roomID}`;
  result.debug = util.inspect(roomlist);
  result.status = "S";

  return result;
}

function joinRoom(req) {
  //join room
  let result = {};
  if (typeof roomlist[req.body.room] != "undefined") {
    roomlist[req.body.room]["participant_list"].push(req.body.name);
    result.message = `Joined Room!`;
    result.status = "S";
  } else {
    result.message = `Room ID (${req.body.room}) does not exist`;
    result.status = "F";
  }

  // res.send(util.inspect(roomlist));
  result.debug = util.inspect(roomlist);

  return result;
}

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;


function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}