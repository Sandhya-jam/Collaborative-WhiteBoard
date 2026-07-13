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

dotenv.config();
const app=express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());

connectDB();
//app.use(express.json());
const server=http.createServer(app);
//Creates a WebSocket server & Attaches it to HTTP server
const io = new Server(server,{
    cors:{
        origin: process.env.CLIENT_URL,
        credentials: true,
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
        if(!roomId || !userId) return;
        const users=roomUsers.get(roomId);
        if(!users) return;
        const user=users.get(userId);
        if(!user) return;

        user.sockets.delete(socket.id);
        //Remove user
        if(user.sockets.size==0){
            users.delete(userId);
            socket.to(roomId).emit("user-left",{name:user.name});
        }
        //Remove room if empty
        if(users.size===0){
            roomUsers.delete(roomId)
        }else{
            io.to(roomId).emit("users-update",
                [...users.values()].map(user=>({
                    userId:user.userId,
                    name:user.name,
                    email:user.email
                }))
            )
        }
        console.log("User disconnected:",socket.id);
    });
});

app.get("/", (req,res)=>{
    res.send("WhiteFlow Backend Running 🚀");
});
app.use('/api/auth',authRoutes)
app.use('/api/rooms',roomRoutes);

const PORT=process.env.PORT||5000
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});