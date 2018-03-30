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
}

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

var pathToRepo = require("path").resolve("tmp");

NodeGit.Repository.open(pathToRepo)
    .then(function (repository) {
        // Access any repository methods here.
        console.log("Is the repository bare? %s", Boolean(repository.isBare()));
        return repository.getMasterCommit();
    }).catch(generalError)
    .then(function(firstCommitOnMaster) {
        var history = firstCommitOnMaster.history(NodeGit.Revwalk.SORT.Time);
        var count = 0;
        history.on("commit", function(commit) {
            count++;
            console.log("commit " + commit.sha());
            console.log("Author:", commit.author().name() +'l'
                " <" + commit.author().email() + ">");
            console.log("Date:", commit.date());
            console.log("\n    " + commit.message());
            if (count == 10) {
                history.removeListener("commit");
            }
        });
        history.start();
    }).catch(generalError());

