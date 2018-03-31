var tableSize = 10;

// expects an array of commits
function fillTable(commits) {
    var table = document.getElementById("commits");
    var size = 0;
    for(var c in commits) {
        var row = document.createElement("tr");

        var dateEl = document.createElement("td");
        var authorEl = document.createElement("td");
        var commitEl = document.createElement("td");
        var shaEl = document.createElement("td");

        var dateVal = commits[c]['date'].split("T")[0];
        var timeVal = commits[c]['date'].split("T")[1];
        timeVal = timeVal.split(".")[0];

        dateEl.innerHTML = dateVal + ", " + timeVal;
        authorEl.innerHTML = commits[c]['author_name'];
        commitEl.innerHTML = commits[c]['message'];

        var shaFull = commits[c]['sha'];
        shaEl.innerHTML = shaFull.substring(0, 10) + "...";

        row.appendChild(dateEl);
        row.appendChild(authorEl);
        row.appendChild(commitEl);
        row.appendChild(shaEl);

        table.appendChild(row);

        size++;
        if (size === tableSize) {
            break;
        }
    }
}

// expects an array of directories
function fillDropdown(repos) {
    var dropdown = document.getElementById("dropdownRepos");
    for(var r in repos) {
        var sel = document.createElement("a");
        sel.className = "dropdown-item";
        sel.innerHTML = repos[r];
        dropdown.appendChild(sel);
    }
}

// Get the available repositories
ajaxRequest('GET','/repos', 'repos');

// Fill the table
ajaxRequest('GET','/commits', 'commits');
