import express from "express"
import http from "http"
import {Server} from "socket.io"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import {roomUsers} from "./store/presenceStore.js"
import { registerDrawingHandlers } from "./socket/drawingHandlers.js"
import { registerHistoryHandlers } from "./socket/historyHandlers.js"
import { registerRoomHandlers } from "./socket/roomHandlers.js"
import authRoutes from './routes/authRoutes.js'
import roomRoutes from './routes/roomRoutes.js'

const app=express();
app.use(cors());
app.use(express.json());

dotenv.config();
connectDB();
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
    registerRoomHandlers(socket,io);

    socket.on("disconnect",()=>{
        const roomId=socket.roomId;
        const userId=socket.userId;
        if(roomId && roomUsers.has(roomId)){{
            const users=roomUsers.get(roomId);
            const sockets=users.get(userId);
            sockets.delete(socket.id);
            if(sockets.size===0){
                users.delete(userId);
            }
            socket.to(roomId).emit("user-left",userId);
            io.to(roomId).emit("users-update",[...users.keys()]);

            if(users.size===0){
                roomUsers.delete(roomId);
            }
            socket.to(roomId).emit("cursor-remove",userId);
        }}
        console.log("User disconnected:",socket.id);
    });
});

app.use('/api/auth',authRoutes)
app.use('/api/rooms',roomRoutes);

const PORT=process.env.PORT||5000
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});