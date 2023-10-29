const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
let username;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log('A user connected');

    socket.on("redirect-req", (n) => {
        io.emit("redirect", "https://theaffanchatlivechat.000webhostapp.com");
    });

    let x = true;
    socket.on('chat message', (message) => {
        while (x === true) {
            io.emit('chat message', message);
            console.log('messages sent');
            x = false;
        };
        setInterval(() => {
            x = true;
        }, 100);
    });

    socket.on("onuser", (t) => {
        io.emit("usern", t);
        username = t;
    });

    socket.on("out", (w) => {
        io.emit("out", w);
        console.log(w + " logged out");
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        io.emit("out", username);
    });
});

const PORT = process.env.PORT || 5500;

server.listen(PORT, () => {
    console.log(`Server is up and running, server listening on port ${PORT}.`);
});
