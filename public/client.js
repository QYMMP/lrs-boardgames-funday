function fetch_chatlog(roomID) {
    // resolve('resolved');
    let params = {};
    params.action = "chatlog";
    params.roomID = roomID;
    result = redirect(params);
    return result.wolflog;
}

async function getChatLog(roomID) {
    let chatlog = document.getElementById("chatlog");

    let result = await fetch_chatlog(roomID);
    let message = "";
    result.forEach(element => {
        message += element;
        message += '<br>';
    });
    chatlog.innerHTML = message;
}

var inRoom = false;
var roomID = "";

setInterval(function () {
    if (inRoom) {
        getChatLog(roomID);
    }
}, 3000);

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
                    roomID = data.roomID;
                    loadPage(data);
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
        })
        .catch(err => {

        });
}