var tableSize = 10;

var selectedRepo;

// expects a string for the repository
function selectRepo(repo) {
    selectedRepo = repo;
    clearDiffs();
    ajaxRequest('POST','/commits', 'commits', repo);
}

function clearDiffs() {
    var tableEl = document.getElementById("commits");
    var allrows = tableEl.rows;
    var l = allrows.length;
    for(var i=0; i < l-1; i++) {
        tableEl.deleteRow(1);
    }
}

// expects a string for the commit SHA
function getDiff(commitSha, commitName) {
    ajaxRequest('POST', '/diff', 'diff', selectedRepo, commitSha);

    var commitsTable = document.getElementById("commitTable");
    commitsTable.style.display = "none";
    var diffEls = document.getElementById("showdiff");
    diffEls.style.display = "block";

    var diffName = document.getElementById("repoNameDiff");
    diffName.innerHTML = commitName;

    var shaInfo = document.getElementById("diffSha");
    shaInfo.innerHTML = commitSha;
}

function showDiffs() {
    var commitsTable = document.getElementById("commitTable");
    commitsTable.style.display = "block";
    var diffEls = document.getElementById("showdiff");
    diffEls.style.display = "none";

    clearDiffs();

    ajaxRequest('POST','/commits', 'commits', selectedRepo);
}

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

        var shaFull = commits[c]['sha'];
        shaEl.innerHTML = shaFull.substring(0, 10) + "...";

        var commitValEl = document.createElement("a");
        commitValEl.href = "javascript:getDiff('" + shaFull + "', '" + commits[c]['message'] + "')";
        commitValEl.innerHTML = commits[c]['message'];
        commitEl.appendChild(commitValEl);

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
        sel.href = "javascript:selectRepo('" + repos[r] + "')";
        sel.className = "dropdown-item";
        sel.innerHTML = repos[r];
        dropdown.appendChild(sel);
    }
}

// Get the available repositories
ajaxRequest('GET','/repos', 'repos');
