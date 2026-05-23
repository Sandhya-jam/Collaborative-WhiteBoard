import express from "express"
import http from "http"
import {Server} from "socket.io"
import cors from "cors"
import dotenv from "dotenv"

const app=express();
app.use(cors());

//app.use(express.json());
const server=http.createServer(app);
//Creates a WebSocket server & Attaches it to HTTP server
const io=new Server(server,{
    cors:{
        origin:"*",
    },
});
//Why CORS here too?
//Socket.IO also needs permission for cross-origin connections.

io.on("connection",(socket)=>{
    console.log("User connected: ",socket.id);
    
    socket.on("draw-action", (action) => {
        //console.log("Received on server:", action);
        socket.broadcast.emit("draw-action", action);
    });
    socket.on("draw-start",(data)=>{
        socket.broadcast.emit("draw-start",data);
    });

    socket.on("draw-move",(data)=>{
        socket.broadcast.emit("draw-move",data);
    });

    socket.on("draw-end",(data)=>{
        socket.broadcast.emit("draw-end",data);
    });
    
    socket.on("undo",(data)=>{
        console.log("undo received on server")
        socket.broadcast.emit("undo",data);
    })
    
    socket.on("redo",(data)=>{
        socket.broadcast.emit("redo",data);
    })

    socket.on("clear-canvas",(data)=>{
        console.log("SERVER GOT CLEAR",data.userId);
        socket.broadcast.emit("clear-canvas",data);
    })
    socket.on("disconnect",()=>{
        console.log("User disconnected:",socket.id);
    });
});

const PORT=process.env.PORT||5000
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});