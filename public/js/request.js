function ajaxRequest(type, url, action, arg1, arg2) {
    var request = new XMLHttpRequest();
    request.open(type, url);
    if(action == 'clone') {
        request.timeout = 20000;
    }
    else {
        request.timeout = 5000;
    }
    request.setRequestHeader('Content-Type', 'application/json');

    request.onload = function () {
        if(action == 'commits') {
            fillTable(JSON.parse(this.responseText));
        }
        else if(action == 'repos') {
            if(this.responseText) {
                var repoAr = JSON.parse(this.responseText);
                if(repoAr.length == 0) {
                    document.getElementById("dropdownReposButton").innerHTML = "No repositories available";
                    var toDel = document.getElementById("dropdownRepos");
                    toDel.remove();
                }
                else {
                    document.getElementById("dropdownReposButton").innerHTML = "Choose one";
                    var dropdown = document.createElement("div");
                    dropdown.id = "dropdownRepos";
                    dropdown.class = "dropdown-menu";
                    dropdown.setAttribute("aria-labelledby", "dropdownReposButton");
                    document.getElementById("dropDownParent").appendChild(dropdown);
                    fillDropdown(repoAr);
                }
            }
            else {
                document.getElementById("dropdownReposButton").innerHTML = "No repositories available";
            }
        }
        else if(action == 'diff') {
            var res = JSON.parse(this.responseText);
            fillDiffTable(res);
        }
        else if (action == 'clone') {
            clearDropdown();
            ajaxRequest('GET','/repos', 'repos');
        }
    };
    request.onerror = function() {
        console.log("There was an error communicating with the server - please try again");
    };
    request.ontimeout = function() {
        console.log("Timeout: please check your internet connection");
    };
    if (action === 'commits') {
        var arg = {
            repo: arg1
        };
        request.send(JSON.stringify(arg));
    }
    else if (action === 'diff') {
        var arg = {
            repo: arg1,
            commitSha: arg2
        };
        request.send(JSON.stringify(arg));
    }
    else if(action === 'clone') {
        var arg = {
            name: arg1,
            url: arg2
        };
        request.send(JSON.stringify(arg));
    }
    else {
        request.send();
    }
}