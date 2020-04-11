'use strict';

// requires
const express = require('express');
const bodyParser = require('body-parser');
const path = require(`path`);
const util = require(`util`);

//require custom classes
const Player = require('./classes/player.js');
const Room = require('./classes/room.js');

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
    let options = {};
    options.roomID = req.body.roomID;
    options.player = req.body.player;
    res.render("gamescreen", options);
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
    case "gamestate":
      result = getGameState(req);
      break;
    case "chat-submit":
      result = updateChatLog(req);
      break;
  }
  if (result.status === "S") {
    let nonce = makeid(10, 'm');
    while (securityNonce.includes(nonce)) {
      nonce = makeid(10, 'm');
    }
    securityNonce.push(nonce);
    result.nonce = nonce;
  }

  res.send(JSON.stringify(result));
});

function createRoom(req) {
  //create room
  let result = {};
  let player = new Player(req.body.name);
  let room = new Room(player);

  let roomID = makeid(5, 'n');
  while (typeof roomlist[roomID] != "undefined") {
    roomID = makeid(5, 'n');
  }
  roomlist[roomID] = room;

  result.player = owner;
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
    let player = new Player(req.body.name);
    roomlist[req.body.room]["participantList"].push(player);
    result.player = player;
    result.message = `Joined Room!`;
    result.redirect = "room";
    result.roomID = req.body.room;
    result.status = "S";
  } else {
    result.message = `Room ID (${req.body.room}) does not exist`;
    result.status = "F";
  }

  // res.send(util.inspect(roomlist));
  result.debug = util.inspect(roomlist);

  return result;
}

function getGameState(req) {
  let result = {};
  result.room = roomlist[req.body.roomID];
  result.status = "S";

  return result;
}

function updateChatLog(req) {
  let player = req.body.player;
  let msg = req.body.msg;

  let formatted = `[${player}]: ${msg}`;
  roomlist[req.body.room]["chatlog"].push(formatted);

  let result = {};
  result.status = "S";
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

function makeid(length, mode) {
  var characters = '';

  switch (mode) {
    case 'a':
      characters = 'abcdefghijklmnopqrstuvwxyz';
      break;
    case 'n':
      characters = '0123456789';
      break;
    case 'm':
      characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
      break;
  }
  var result = '';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}