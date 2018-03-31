function ajaxRequest(type, url, action) {
    var request = new XMLHttpRequest();
    request.open(type, url);
    request.timeout = 5000;
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if(action == 'commits') {
            fillTable(JSON.parse(this.responseText));
        }
        else if(action == 'repos') {
            if(this.responseText) {
                console.log(JSON.parse(this.responseText));
            }
            else {
                console.log("No repositories available");
            }
        }
    };
    request.onerror = function() {
        console.log("There was an error communicating with the server - please try again");
    };
    request.ontimeout = function() {
        console.log("Timeout: please check your internet connection");
    };
    request.send();
}