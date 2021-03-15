const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const express = require('express');
const path = require('path');

var vote = JSON;
var userNumber = 1;
var status = JSON;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.use("/static", express.static(path.join(__dirname, '/static')));

io.on('connection', (socket) => {
    var myNumber = userNumber++;
    console.log('user connected, id: ' + myNumber);
    status[myNumber] = 1;
    vote[myNumber] = 0;

    socket.on('disconnect' , () => {
        console.log('user disconnected, id: ' + myNumber);
        status[myNumber] = 0;
        vote[myNumber] = 0;
        results = statistics(status,vote);
        console.log(results);
        io.emit('chat message', results);
    });

    socket.on('chat message', (msg) => {
        console.log('id: '+myNumber + ' vote state: ' + msg);

        vote[myNumber]=msg;
        results = statistics(status,vote);
        console.log(results);
        io.emit('chat message', results);

        // console.log(vote);
        // console.log( status);
        
      });
  });

http.listen(3000, () => {
  console.log('listening on *:3000');
});

function statistics(status,vote){
    var votefor_ttl = 0;
    var voteagainat_ttl = 0;
    // console.log(vote,status);
    for (i = 1; i<=Object.keys(status).length; i++){
        if ( vote[i.toString()] == 1){
            votefor_ttl = votefor_ttl+1;
        };
        if (vote[i.toString()] == -1){
            voteagainat_ttl = voteagainat_ttl+1;
        };
    }
    return [votefor_ttl,voteagainat_ttl];
}
