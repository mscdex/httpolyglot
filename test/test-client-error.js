var fs = require('fs');
var http = require('http');
var net = require('net');
var assert = require('assert');

var common = require(__dirname + '/common');
var httpolyglot = require(__dirname + '/../lib/index');

// The HTTP parser reports the buffer containing an invalid header. Protocol
// detection must not split its first byte from the rest of that buffer.
// rawPacket was added in Node.js 9.4.0. Older runtimes exercise the
// existing protocol and disconnect tests instead.
if (parseInt(process.versions.node, 10) < 10)
  return;

var packet = 'GET / HTTP/1.1\r\nInvalid Header\r\n\r\n';
var options = {
  key: fs.readFileSync(__dirname + '/fixtures/server.key'),
  cert: fs.readFileSync(__dirname + '/fixtures/server.crt')
};

[http, httpolyglot].forEach(function(protocol) {
  var srv = protocol.createServer(options, function() {
    assert(false, 'An invalid request should not reach the request handler');
  });
  srv.on('clientError', common.mustCall(function(err, socket) {
    socket.destroy();
    srv.close();
    assert.strictEqual(err.code, 'HPE_INVALID_HEADER_TOKEN');
    assert.strictEqual(err.rawPacket.toString(), packet);
  }));
  srv.listen(0, '127.0.0.1', common.mustCall(function() {
    var socket = net.connect(this.address().port, '127.0.0.1', function() {
      socket.end(packet);
    });
  }));
});
