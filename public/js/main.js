var tableSize = 10;

var selectedRepo;

// from https://stackoverflow.com/questions/1219860/html-encoding-lost-when-attribute-read-from-input-field
function htmlEncode(value){
    // Create a in-memory div, set its inner text (which jQuery automatically encodes)
    // Then grab the encoded contents back out. The div never exists on the page.
    return $('<div/>').text(value).html();
}

// expects a string for the repository
function selectRepo(repo) {
    selectedRepo = repo;
    document.getElementById("dropdownReposButton").innerHTML = repo;
    clearDiffs();
    document.getElementById("showdiff").style.display = "none";
    document.getElementById("backNav").style.display = "none";
    ajaxRequest('POST', '/commits', 'commits', repo);
}

function clearDiffs() {
    var tableEl = document.getElementById("commits");
    var allrows = tableEl.rows;
    var l = allrows.length;
    for(var i=0; i < l-1; i++) {
        tableEl.deleteRow(1);
    }
}

function cloneRepo() {
    var url = document.getElementById("repoUrl").value;
    var name = document.getElementById("cloneRepoName").value;
    document.getElementById("pleaseWaitMsg").style.display = 'block';
    ajaxRequest('POST', '/clone', 'clone', name, url);
}

// expects a string for the commit SHA
function getDiff(commitSha, commitName) {
    ajaxRequest('POST', '/diff', 'diff', selectedRepo, commitSha);

    document.getElementById("commitTable").style.display = "none";
    document.getElementById("backNav").style.display = "block";
    document.getElementById("showdiff").style.display = "block";

    var diffName = document.getElementById("repoNameDiff");
    diffName.innerHTML = commitName;

    var shaInfo = document.getElementById("diffSha");
    shaInfo.innerHTML = commitSha;

    document.getElementById("showdiff").style.display = "block";
}

function showDiffs() {

    document.getElementById("commitTable").style.display = "block";
    document.getElementById("backNav").style.display = "none";
    document.getElementById("showdiff").style.display = "none";
    clearDiffs();

    ajaxRequest('POST','/commits', 'commits', selectedRepo);
}

// expects an array of commits
function fillTable(commits) {
    var commitsTable = document.getElementById("commitTable");
    commitsTable.style.display = "block";
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

function clearDropdown() {
    var dropdown = document.getElementById("dropdownRepos");
    var allrepos = dropdown.childNodes;
    var l = allrepos.length;
    for(var i=0; i < l; i++) {
        dropdown.removeChild(allrepos[0]);
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

// expects an array of diffs
// diff obj:
//  {
//      path: string
//      header: string
//      lines: array of strings
//  }
function fillDiffTable(diffs) {
    var dTable = document.getElementById("diffTable");
    diffs.forEach(function(d) {
        var path = d['path'];
        var header = d['header'];
        var lines = d['lines'];

        var pathRow = document.createElement("tr");
        pathRow.innerHTML = path;
        pathRow.style.border = "1px solid black";
        pathRow.style.backgroundColor = "#ffffff";
        dTable.appendChild(pathRow);

        var headerRow = document.createElement("tr");
        headerRow.innerHTML = header;
        headerRow.style.backgroundColor = "#b3d9ff";
        dTable.appendChild(headerRow);

        lines.forEach(function(l) {
            var lineRow = document.createElement("tr");
            lineRow.innerHTML = htmlEncode(l);
            if(l[0] === "+") {
                lineRow.style.backgroundColor = "#33cc33";
            }
            else if(l[0] === "-") {
                lineRow.style.backgroundColor = "#ff3333";
            }
            else {
                lineRow.style.backgroundColor = "#ffffff";
            }
            dTable.appendChild(lineRow);
        });

        var blank = document.createElement("tr");
        blank.innerHTML = "&nbsp";
        blank.style.backgroundColor = "#ffffff";
        dTable.appendChild(blank);
    });

}

window.onload = function() {
    // Get the available repositories
    ajaxRequest('GET','/repos', 'repos');

    $("#cloneRepo").on('shown.bs.modal', function(){
        var input = document.getElementById("repoUrl");
        input.value = "";
        input.focus();
    });
};

