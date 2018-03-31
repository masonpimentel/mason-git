var MNodeGit = require("./nodegit.js");

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var pathToRepo = path.resolve("tmp");

function getRepos(resp) {
    fs.readdir(path.resolve("repositories"), function(err, dirs) {
        if (err) {
            console.log(err);
        }
        else {
            resp.status(200).send(dirs);
        }
    });
}

//GET repositories
app.get('/repos', function(request, response) {
    console.log('repos');
    var repos = getRepos(response);

});

//GET commits
app.get('/commits', function(request, response) {
    var res = MNodeGit.getCommits(pathToRepo, response);
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});