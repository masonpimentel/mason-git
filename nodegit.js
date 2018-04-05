var NodeGit = require("nodegit");

var localPath = require("path").join(__dirname, "repositories");

var cloneOptions = {};

var clonedRepo = {}

cloneOptions.fetchOpts = {
    callbacks: {
        certificateCheck: function() { return 1; }
    }
};
cloneOptions.bare = 1;

var generalError = function(r) {
    console.log(r);
    gResp.status(400).send(r.stack);
};

var gResp = null;
exports.cloneRepository = function(name, url, localPath, resp) {
    var cloneRepository = NodeGit.Clone(url, localPath + "/" + name + ".git", cloneOptions);
    gResp = resp;
    cloneRepository.catch(generalError)
        .then(function(){
            resp.status(200).send();
        });
};

exports.getCommits = function(pathToRepo, resp) {
    var commits = [];
    NodeGit.Repository.openBare(pathToRepo + ".git")
        .then(function (repository) {
            return repository.getMasterCommit();
        })
        .then(function(firstCommitOnMaster) {
            var history = firstCommitOnMaster.history(NodeGit.Revwalk.SORT.Time);
            var count = 0;
            history.on("commit", function(commit) {
                count++;
                commits.push({
                    sha: commit.sha(),
                    author_name: commit.author().name(),
                    author_email: commit.author().email(),
                    date: commit.date(),
                    message: commit.message()
                });
            });
            history.on("end", function() {
                resp.status(200).send(commits);
            });
            history.start();
        }).catch(generalError);
};

exports.getDiff = function(pathToRepo, commitSha, resp) {
    var diffFiles = [];
    NodeGit.Repository.openBare(pathToRepo + ".git")
        .then(function(repo) {
            return repo.getCommit(commitSha);
        })
        .then(function(commit) {
            console.log("commit " + commit.sha() + "\n");
            return commit.getDiff();
        })
        .then(function(diffList) {
            diffList.forEach(function (diff, diffCount) {
                diff.patches().then(function (patches) {
                    patches.forEach(function (patch, patchCount) {
                        patch.hunks().then(function (hunks) {
                            hunks.forEach(function (hunk, hunkCount) {
                                hunk.lines().then(function (lines) {
                                    var lineContentAr = [];
                                    var diffFileObj = {
                                        path: "diff" + " " + patch.oldFile().path() + " " + patch.newFile().path(),
                                        header: hunk.header(),
                                        lines: lineContentAr
                                    };
                                    lines.forEach(function (line, lineCount) {
                                        lineContentAr.push(String.fromCharCode(line.origin()) + line.content());
                                        if((diffCount == diffList.length-1) && (patchCount == patches.length-1) && (hunkCount == hunks.length-1) && (lineCount == lines.length-1)) {
                                            console.log("all done");
                                            diffFiles.push(diffFileObj);
                                            resp.status(200).send(diffFiles);
                                        }
                                    });
                                    diffFiles.push(diffFileObj);
                                });
                            });
                        });
                    });
                });

            });
        }).catch(generalError);
};
