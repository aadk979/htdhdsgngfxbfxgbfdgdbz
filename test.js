const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");


const options = {
  method: 'POST',
  hostname: 'api.render.com',
  port: null,
  path: '/v1/services/srv-ckud7cmb0mos738u2ssg/resume',
  headers: {
    accept: 'application/json',
    authorization: 'Bearer rnd_dbjVtRsFHMVGqUPbdHtlPLN4ulbq'
  }
};


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log('A user connected');
    
    socket.on("redirect-req", n =>{
        io.emit("redirect" , ("https://theaffanchatlivechat.000webhostapp.com"));
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

    socket.on("server-kill", ({ d1, d2 }) => {
    if (d1 === "iloveamelie" && d2 === "260908180608") {
        io.emit("server", "Server has shut down");
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
            console.error(error);
        });

        req.end();
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
