var NodeGit = require("nodegit");

var cloneURL = "https://github.com/snxfz947/DotifyPublic.git";

var localPath = require("path").join(__dirname, "tmp");

var cloneOptions = {};

cloneOptions.fetchOpts = {
    callbacks: {
        certificateCheck: function() { return 1; }
    }
};

var errorAndAttemptOpen = function(r) {
    console.log(r);
    return NodeGit.Repository.open(local);
};

var generalError = function(r) {
    console.log(r);
};

// if nothing in tmp

// var cloneRepository = NodeGit.Clone(cloneURL, localPath, cloneOptions);
//
// cloneRepository.catch(errorAndAttemptOpen)
//     .then(function(repository) {
//         // Access any repository methods here.
//         console.log("Is the repository bare? %s", Boolean(repository.isBare()));
//         return repository.getMasterCommit();
//     }).catch(generalError)
//     .then(function(firstCommitOnMaster) {
//         var history = firstCommitOnMaster.history(NodeGit.Revwalk.SORT.Time);
//         var count = 0;
//         history.on("commit", function(commit) {
//             count++;
//             console.log("commit " + commit.sha());
//             console.log("Author:", commit.author().name() +
//                 " <" + commit.author().email() + ">");
//             console.log("Date:", commit.date());
//             console.log("\n    " + commit.message());
//             if (count == 10) {
//                 console.log("wat");
//                 history.removeListener("commit", function() {
//                     console.log("Done");
//                 });
//             }
//         });
//         history.start();
//     }).catch(generalError());

exports.getCommits = function(pathToRepo, resp) {
    var commits = [];
    NodeGit.Repository.open(pathToRepo)
        .then(function (repository) {
            return repository.getMasterCommit();
        }).catch(generalError)
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
    NodeGit.Repository.open(pathToRepo)
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
        });
};
