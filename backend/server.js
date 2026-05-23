import express from "express"
import http from "http"
import {Server} from "socket.io"
import cors from "cors"
import dotenv from "dotenv"
import { registerDrawingHandlers } from "./socket/drawingHandlers.js"
import { registerHistoryHandlers } from "./socket/historyHandlers.js"
import { registerRoomHandlers } from "./socket/roomHandlers.js"

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
const rooms={};
io.on("connection",(socket)=>{
    console.log("User connected: ",socket.id);
    
    registerDrawingHandlers(socket);
    registerHistoryHandlers(socket);
    registerRoomHandlers(socket);

    socket.on("disconnect",()=>{
        console.log("User disconnected:",socket.id);
    });
});

const PORT=process.env.PORT||5000
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});