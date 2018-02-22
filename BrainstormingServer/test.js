var express = require('express');
var http = require('http')
var socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
server.listen(3000, () => console.log('listening on *:3000'));

var io = socketIO(server)

// The event will be called when a client is connected.
io.on('connection', (socket) => {
	socket.on('disconnect', (reason) => {
    console.log('A client just left', socket.id);
  });
	socket.on('hello', (data) => {
	  console.log('data is '+data);
	});
  console.log('A client just joined on', socket.id);
});
