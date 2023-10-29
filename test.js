const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const options = {
  method: 'POST',
  hostname: 'api.render.com',
  port: null,
  path: '/v1/services/srv-ckud7cmb0mos738u2ssg/suspend',
  headers: {
    accept: 'application/json',
    authorization: 'Bearer rnd_dbjVtRsFHMVGqUPbdHtlPLN4ulbq'
  }
};
function kill() {
    const req = http.request(options, function (res) {
        const chunks = [];

        res.on('data', function (chunk) {
            chunks.push(chunk);
        });

        res.on('end', function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.on('error', function (error) {
        console.error('Error:', error.message);
        io.emit('server' , error.message);
    });

    req.end();
}

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
    });

    socket.on("out", (w) => {
        io.emit("out", w);
        console.log(w + " logged out");
    });

    socket.on("server-kill", (data) => {
        console.log('shutdown request received');
        if (data.akc === "w" && data.acc === "3") {
            io.emit("server", "Server has shut down");
            kill();
        } else {
            io.emit("server", "Authentication failed, unable to shut down the server.");
            console.log('server shutdown rejected due to authentication failure');
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
