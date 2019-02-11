var request = require('request');
var token = require('./secrets').GITHUB_TOKEN;

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${token}`
    }
  };

  request(options, function (err, res, body) {
    var obj = cb(err, body);

    obj.forEach(elem => {
      console.log(elem['avatar_url']);
    });
  });
}

getRepoContributors("jquery", "jquery", function (err, result) {
  console.log("Errors:", err);
  // console.log("Result:", result);
  return JSON.parse(result);
});