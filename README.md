
Description
===========

A module for serving http and https connections over the same port.


Requirements
============

* [node.js](http://nodejs.org/) -- v0.10.0 or newer


Install
============

    npm install httpolyglot


Examples
========

* Start a server:

```javascript
var httpolyglot = require('httpolyglot');
var fs = require('fs');

httpolyglot.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
}, function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end((req.socket.encrypted ? 'HTTPS' : 'HTTP') + ' Connection!');
}).listen(9000, 'localhost', function() {
  console.log('httpolyglot server listening on port 9000');
  // visit http://localhost:9000 and https://localhost:9000 in your browser ...
});
```


API
===

Exports
-------

* **Server** - A class similar to https.Server (except instances have `setTimeout()` from http.Server).

* **createServer**(< _object_ >tlsConfig[, < _function_ >requestListener]) - _Server_ - Creates and returns a new Server instance.
