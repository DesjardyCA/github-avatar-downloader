var request = require('request');
var token = require('./secrets').GITHUB_TOKEN;
var fs = require('fs');
var inp = process.argv.slice(2);

// error handling for input before executing remainder of code
if (!inp[0] || !inp[1]) {
  console.log('Please type both a username and a repository name!');
  throw "needs username and repository";
}

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
    // calls getRepoContributors() to parse and return body as on object parsed by JSON
    var obj = cb(err, body);

    // loops through each file to download and assigns filename to output as
    obj.forEach(elem => {
      downloadImageByURL(elem['avatar_url'], elem['login'] + '.jpg');
    });
  });
}

// parses body returned by request and outputs as an object
getRepoContributors(inp[0], inp[1], function (err, result) {
  console.log("Errors:", err);
  return JSON.parse(result);
});

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    .on('response', function (response) {
      console.log('Downloading image...');
    })
    .on('end', function () {
      console.log('Download complete.');
    })
    // writes file to unique file within folder "avatars"
    .pipe(fs.createWriteStream('avatars/' + filePath));
}