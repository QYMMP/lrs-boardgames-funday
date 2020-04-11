function refreshChatLog(roomID) {
    let params = {};
    params.action = "chatlog";
    params.roomID = roomID;

    redirect(params);
}

var inRoom = false;
var roomID = "";

setInterval(function () {
    if (inRoom) {
        refreshChatLog(roomID);
    }
}, 5000);

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
                if (typeof (data.wolflog) !== 'undefined') {
                    let message = "";
                    data.wolflog.forEach(element => {
                        message += element;
                        message += '<br>';
                    });
                    document.getElementById("chatlog").innerHTML = message;
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