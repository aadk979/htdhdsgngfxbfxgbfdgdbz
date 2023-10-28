const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});
// Assuming you have a Socket.IO server instance named 'io'
function disconnectAllUsers() {
    // Get a list of connected sockets
    const connectedSockets = io.sockets.sockets;

    // Loop through each socket and disconnect it
    for (const socketId in connectedSockets) {
        const socket = connectedSockets[socketId];
        socket.disconnect(true); // Close the socket
    }
}



io.on("connection", (socket) => {
    const userIP = socket.handshake.address;
    console.log(userIP);
    console.log('A user connected');
    
    socket.on("redirect-req", n =>{
        io.emit("redirect" , ("http://google.com"));
    });

    let x = true;
    socket.on('chat message', (message ) => {
       while (x === true){
       io.emit('chat message', (message ));
       console.log('messages sent');
       x = false;
       };
       setInterval(() => {
        x = true;
       },100);
    });
    
    socket.on("onuser", (t) => {
        io.emit("usern", t);
       
    });

    socket.on("out", (w) => {
        io.emit("out", w);
        console.log(w + " logged out");
    });

    socket.on("server-kill", (authData) => {
        const { authkey, authcode } = authData; // Destructure the authData object
        if (authkey === "iloveamelie" && authcode === "260908180608") { 
            io.emit("server", "Server has shut down");
            disconnectAllUsers();
            server.close();
            io.emit("server", "Server has shut down");
            
            console.log("shutdown success")
            
        } else {
            io.emit("server", "Authentication failed, unable to shut down the server.");
        }
    });
    

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
    console.log(`Server is up and running, server listening on port ${PORT}.`);
});
