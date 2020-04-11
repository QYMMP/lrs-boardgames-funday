'use strict';

// requires
const express = require('express');
const bodyParser = require('body-parser');
const path = require(`path`);
const util = require(`util`);

//setup ExpressJS
//body parser to parse JSON
//serve static files
//set View Engine to EJS files
//set views filepath
const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

var counter = 0;
var roomlist = [];

var securityNonce = [];

app.get('/', (req, res) => {
  res.render('mainmenu');
});

app.post('/room', (req, res) => {
  let index = securityNonce.indexOf(req.body.nonce);
  if (index >= 0) {
    securityNonce.splice(index, 1);
    res.render("gamescreen", { roomID: req.body.roomID, player: req.body.player });
  } else {
    res.send("Bad activity detected");
  }
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
    case "chatlog":
      result = getChatLog(req);
      break;
    case "chat-submit":
      result = updateChatLog(req);
      break;
  }
  if (result.status === "S") {
    let nonce = makeid(10);
    while (securityNonce.includes(nonce)) {
      nonce = makeid(10);
    }
    securityNonce.push(nonce);
    result.nonce = nonce;
  }

  res.send(JSON.stringify(result));
});

function createRoom(req) {
  //create room
  let result = {};
  let room = [];
  room["owner"] = req.body.name;
  room["participant_list"] = [req.body.name];
  room["wolflog"] = [];

  let roomID = makeid(5);
  while (typeof roomlist[roomID] != "undefined") {
    roomID = makeid(5);
  }
  roomlist[roomID] = room;
  result.player = req.body.name;
  result.message = `Room created! Room ID: ${roomID}`;
  result.debug = util.inspect(roomlist);
  result.redirect = "room";
  result.roomID = roomID;
  result.status = "S";

  return result;
}

function joinRoom(req) {
  //join room
  let result = {};
  if (typeof roomlist[req.body.room] != "undefined") {
    roomlist[req.body.room]["participant_list"].push(req.body.name);
    result.player = req.body.name;
    result.message = `Joined Room!`;
    result.redirect = "room";
    result.roomID = roomID;
    result.status = "S";
  } else {
    result.message = `Room ID (${req.body.room}) does not exist`;
    result.status = "F";
  }

  // res.send(util.inspect(roomlist));
  result.debug = util.inspect(roomlist);

  return result;
}

function getChatLog(req) {
  let room = roomlist[req.body.roomID];
  let result = {};
  result.wolflog = room["wolflog"];
  result.success = "S";

  return result;
}

function updateChatLog(req) {
  let player = req.body.player;
  let msg = req.body.msg;

  let formatted = `[${player}]: ${msg}`;
  roomlist[req.body.roomID]["wolflog"].push(formatted);

  let result = {};
  result.success = "S";
  result.clearChatInput = true;
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