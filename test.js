const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://aadk979:gYWofYDbGY7mGYF8@mainuserdatabse.8adbyfl.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

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

    socket.on("server-kill", (authData) => {
        const { authkey, authcode } = authData; // Destructure the authData object
        if (authkey === "iloveamelie" && authcode === "260908180608") { 
            io.emit("server", "Server has shut down");
            disconnectAllUsers();
            server.close(()=>{
                console.log("!!server terminated!!")
            });
            io.emit("server", "Server has shut down");
            
            
            
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
