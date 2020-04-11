function fetch_chatlog(roomID) {
    // const params = prepareUpdateData();
    // let options = {};
    // options.body = params;
    // options.method = "POST";
    // options.headers = {
    //     "Content-Type": "application/x-www-form-urlencoded"
    // };
    // options.credentials = "same-origin";

    // fetch(ajaxurl, options)
    //     .then(r => r.json())
    //     .then(data => {
    //         switch (data["status_flag"]) {
    //             case "S":
    //                 if (
    //                     data.hasOwnProperty("colHeaders") ||
    //                     data.hasOwnProperty("rowHeaders")
    //                 )
    //                     updateHeaders(data);
    //                 initTrackers();
    //             default:
    //                 alert(data.msg);
    //         }
    //         hideLoading();
    //     });
    // options.body = params;
    // options.method = "POST";
    // // options.headers = {
    // //     "Content-Type": "application/x-www-form-urlencoded"
    // // };

    // fetch(window.location.hostname + '/getChatLog', options)
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data)
    //     })
    //     .catch(err => ...)
}

function submitForm() {
    let params = {};
    let options = {};
    let action = this.id;
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
    options.body = JSON.stringify(params);
    options.method = "POST";
    options.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    fetch(window.location.hostname + '/redirect', options)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(err => {

        });
}