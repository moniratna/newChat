const fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);
socketioRedis = require('socket.io-redis');



app.use(express.static('static'));

io.adapter(socketioRedis({host: '127.0.0.1', port: 6379}));

let peersByRoom = {};

io.on('connection', (socket) => {
    console.log('connected');
    socket.on('messageToBE',async (room,messages,name) => {
        socket.join(room);
        console.log(room);
        console.log("ALL ROOMS")
        ss = await io.of('/').adapter.allRooms();
	    console.log(await io.of('/').adapter.allRooms());
	    console.log("ALL SOCKETS IN ROOM ", room)
	    console.log(await io.in(room).allSockets());

        // if (!peersByRoom[data.roomID]) {
        //     peersByRoom[data.roomID] = [{ id: data.userID }];
        // } else if (!peersByRoom[data.roomID].find(peer => peer.id === data.userID)) {
        //     peersByRoom[data.roomID].push({ id: data.userID });
        // }

        // let newMessage = { ...data, peers: peersByRoom[data.roomID] }
        
        // if (data.type === 'leave') {
        //     newMessage = { ...data, peers: peersByRoom[data.roomID]
        //         .filter(peer => peer.id !== data.userID) }
        // }
 
        socket.to(room).broadcast.emit('messageToBE', messages);
        console.log(name + messages);
    });

    socket.on('disconnect', () => {
        console.log('disconnect');
    })
})

http.listen(3001, () => {
    console.log('started')
});
