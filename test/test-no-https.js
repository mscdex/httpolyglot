var fs = require('fs');
var http = require('http');
var https = require('https');
var assert = require('assert');

var common = require(__dirname + '/common');
var httpolyglot = require(__dirname + '/../lib/index');

var srv = httpolyglot.createServer(null, common.mustCall(function(req, res) {
  res.end(req.socket.encrypted ? 'https' : 'http');
}, 1));
assert(srv instanceof http.Server);
srv.listen(0, '127.0.0.1', common.mustCall(function() {
  var port = this.address().port;
  var count = 2;
  function done() {
    if (--count === 0) {
      srv.close();
    }
  }

  http.get({
    host: '127.0.0.1',
    port: port
  }, common.mustCall(function(res) {
    var body = '';
    res.on('data', function(data) {
      body += data;
    }).on('end', common.mustCall(function() {
      assert.strictEqual(body, 'http');
      done();
    }));
  }));

  https.get({
    host: '127.0.0.1',
    port: port,
    rejectUnauthorized: false
  }, function() {
    assert(false, 'The request should have failed for the lack of TLS config');
  }).on('error', common.mustCall(function(err) {
    assert.strictEqual(err.code, 'ECONNRESET');
    done();
  }));
}));
