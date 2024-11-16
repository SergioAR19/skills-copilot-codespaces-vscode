// Create web server
var http = require('http');
var fs = require('fs');
var path = require('path');
var comments = require('./comments.json');
var url = require('url');
var qs = require('querystring');
var mime = require('mime');

var server = http.createServer(function(req, res) {
  if (req.method === 'GET') {
    handleGetRequest(req, res);
  } else if (req.method === 'POST') {
    handlePostRequest(req, res);
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

function handleGetRequest(req, res) {
  var parsedUrl = url.parse(req.url);
  var pathname = parsedUrl.pathname;
  if (pathname === '/') {
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream('./index.html').pipe(res);
  } else if (pathname === '/comments') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(comments));
  } else {
    var filePath = path.join(__dirname, pathname);
    var stream = fs.createReadStream(filePath);
    stream.on('error', function() {
      res.statusCode = 404;
      res.end('Not Found');
    });
    res.setHeader('Content-Type', mime.lookup(filePath));
    stream.pipe(res);
  }
}

function handlePostRequest(req, res) {
  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    var comment = qs.parse(body);
    comments.push(comment);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(comments));
  });
}

server.listen(3000, function() {
  console.log('Server is listening at port 3000');
});
// Run and test the server
// Run the server by running the following command in the terminal:
// node comments.js
// Open your web browser and visit http://localhost:3000. You should see the form to add a new comment.
// Add a new comment and click the Add Comment button. You should see the new comment appear in the list of comments.
// Open your web browser's developer tools and go to the Network tab. Refresh the page and observe the requests being made by the browser.
// You should see a GET request to fetch the index.html file, and another GET request to fetch the comments.