/**
 * Created by Dennis on 9/9/15.
 */

//Initialize all the socket.io items that are needed
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs'); // required for file serving

function logDisconnect(SID){
    var disconnectTime = Date.now();
    var sql = "UPDATE tblUser SET LastSeen='"+ disconnectTime +"' WHERE SocketID=" + SID;
}

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    var SID = socket.id;
    io.emit('chat message', 'user connected');
    socket.on('disconnect', function(){
        var SID = socket.id;
        console.log('user disconnected');
        logDisconnect(SID);
        io.emit('chat message', 'user has disconnected');
    });
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        var SID = socket.id;
        io.emit('chat message', msg);
    });
});

// trying to serve the image file from the server
io.on('connection', function(socket){
    fs.readFile(__dirname + '/coolguy.jpeg', function(err, buf){
        io.emit('image', { image: true, buffer: new Buffer(buf).toString('base64') });
        console.log('image file is initialized');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});