var MNodeGit = require("./nodegit.js");
var localConfig = require("./config.js");

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function getRepos(resp) {
    fs.readdir(localConfig.repoPath, function(err, dirs) {
        if (err) {
            console.log(err);
        }
        else {
            for(var i=0; i < dirs.length; i++) {
                dirs[i] = dirs[i].split(".git")[0];
            }
            resp.status(200).send(dirs);
        }
    });
}

//GET repositories
app.get('/repos', function(request, response) {
    var repos = getRepos(response);
});

//POST commits
app.post('/commits', function(request, response) {
    MNodeGit.getCommits(path.resolve(localConfig.repoPath, request.body.repo), response);
});

//POST diff
app.post('/diff', function(request, response) {
   MNodeGit.getDiff(path.resolve(localConfig.repoPath, request.body.repo), request.body.commitSha, response);
});

//POST clone
app.post('/clone', function(request, response) {
    MNodeGit.cloneRepository(request.body.name, request.body.url, localConfig.repoPath, response);
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});