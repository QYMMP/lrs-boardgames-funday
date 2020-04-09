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
app.use(bodyParser.urlencoded({ extended: true }));

var counter = 0;
var roomlist = [];


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/mainmenu.html'));
});

app.post('/room', (req, res) => {
  // console.log({
  //   name: req.body.name,
  //   message: req.body.message
  // });
  // res.send('Thanks for your message!');
  if (typeof req.body.create != "undefined") {
    //create room
    const room = [];
    room["owner"] = req.body.name;
    room["participant_list"] = [req.body.name];
    const roomID = makeid(5);
    while (typeof roomlist[roomID] != "undefined") {
      roomID = makeid(5);
    }
    roomlist[roomID] = room;
    res.send(`Room created! Room ID: ${roomID}`)
  } else if (typeof req.body.join != "undefined") {
    //join room
    if (typeof roomlist[req.body.room] != "undefined") {
      roomlist[req.body.room]["participant_list"].push(req.body.name);
      res.send(`Joined Room!`);
    } else {
      res.send(`Room ID (${req.body.room}) does not exist`);
    }
  }
  res.end(util.inspect(roomlist));
});

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

console.log(makeid(5));