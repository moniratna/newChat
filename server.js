const fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);

let peersByRoom = {};

io.on('connection', (socket) => {
    console.log('connected');
    socket.on('messageToBE', data => {
        socket.join(`${data.roomID}`);

        if (!peersByRoom[data.roomID]) {
            peersByRoom[data.roomID] = [{ id: data.userID }];
        } else if (!peersByRoom[data.roomID].find(peer => peer.id === data.userID)) {
            peersByRoom[data.roomID].push({ id: data.userID });
        }

        let newMessage = { ...data, peers: peersByRoom[data.roomID] }
        
        if (data.type === 'leave') {
            newMessage = { ...data, peers: peersByRoom[data.roomID]
                .filter(peer => peer.id !== data.userID) }
        }
 
        socket.to(`${data.roomID}`).broadcast.emit('messageToFE', newMessage);
    });

    socket.on('disconnect', () => {
        console.log('disconnect');
    })
})

http.listen(3001, () => {
    console.log('started')
});
