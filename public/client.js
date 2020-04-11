function fetch_chatlog(roomID) {
    
}

function submitForm() {
    let action = this.id;

    let params = {};
    params.action = action;
    switch (action) {
        case "create":
            params.name = document.getElementById("name").value;
            break;
        case "join":
            params.name = document.getElementById("name").value;
            params.room = document.getElementById("room").value;
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
            if (data.status === "S" && typeof(data.redirect) !== 'undefined') {
                loadPage(data);
            }
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
        })
        .catch(err => {

        });
}