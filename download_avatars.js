var request = require('request');
var token = require('./secrets').GITHUB_TOKEN;
var fs = require('fs');
var inp = process.argv.slice(2);

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
      // console.log(elem['avatar_url']);
      downloadImageByURL(elem['avatar_url'], elem['login'] + '.jpg');
    });
  });
}

getRepoContributors(inp[0], inp[1], function (err, result) {
  console.log("Errors:", err);
  // console.log("Result:", result);
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
    .pipe(fs.createWriteStream('avatars/' + filePath));
}