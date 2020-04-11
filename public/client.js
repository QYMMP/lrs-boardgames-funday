var inRoom = false;
var roomID = "";

function syncGameState(){
    let params = {};
    params.action = "gamestate";
    params.roomID = roomID;
    redirect(params);
}

function updatePage(room){
    //chatlog
    let message = "";
    room.chatlog.forEach(element => {
        message += element;
        message += '<br>';
    });
    document.getElementById("chatlog").innerHTML = message;

    let playerlist = "";
    let playercount = 1;
    room.participantList.forEach(participant => {
        playerlist += playercount;
        playerlist += ". "
        playerlist += participant.name;
        playerlist += '<br>';
        playercount++;
    });
    document.getElementById("player-list").innerHTML = playerlist;
}

setInterval(function () {
    if (inRoom) {
        syncGameState();
    }
}, 1000);

function submitForm() {
    let params = {};
    params.action = this.id;
    redirect(params);
}

function redirect(params) {
    let action = params.action;

    switch (action) {
        case "create":
            params.name = document.getElementById("name").value;
            break;
        case "join":
            params.name = document.getElementById("name").value;
            params.room = document.getElementById("room").value;
            break;
        case "chat-submit":
            params.player = document.getElementById("player").value;
            params.room = document.getElementById("roomID").value;
            params.msg = document.getElementById("chat-input").value;
            break;
    }

    let options = {};
    options.body = JSON.stringify(params);
    options.method = "POST";
    options.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    fetch('/redirect', options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.status === "S") {
                if (typeof (data.redirect) !== 'undefined') {
                    loadPage(data);
                    roomID = data.roomID;
                    inRoom = true;
                }
                if (typeof (data.room) !== 'undefined') {
                    updatePage(data.room);
                }
                if (typeof (data.clearChatInput) !== 'undefined') {
                    document.getElementById("chat-input").value = "";
                }
            }

            return data;
        })
        .catch(err => {

        });
}

function loadPage(req) {
    let redirect = "/" + req.redirect;
    let options = {};
    options.body = JSON.stringify(req);
    options.method = "POST";
    options.headers = {
        'Content-Type': 'application/json'
    };
    fetch(redirect, options)
        .then(response => response.text())
        .then(data => {
            document.getElementById("contentDiv").innerHTML = data;
            let chatSubmitButton = document.getElementById("chat-submit");
            chatSubmitButton.addEventListener('click', submitForm, false);

            // Get the input field
            let chatInput = document.getElementById("chat-input");

            // Execute a function when the user releases a key on the keyboard
            chatInput.addEventListener("keyup", function (event) {
                // Number 13 is the "Enter" key on the keyboard
                if (event.keyCode === 13) {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    // Trigger the button element with a click
                    chatSubmitButton.click();
                }
            });
        })
        .catch(err => {

        });
}