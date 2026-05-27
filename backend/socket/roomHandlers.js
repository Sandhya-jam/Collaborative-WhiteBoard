import Room from "../models/Room.js";
import {roomUsers} from "../store/presenceStore.js";

export function registerRoomHandlers(socket,io){
    socket.on("join-room",async({roomId,userId})=>{
        socket.join(roomId);
        socket.roomId=roomId;
        socket.userId=userId;
        // Add user to the room
        if (!roomUsers.has(roomId)) {
            roomUsers.set(roomId, new Set());
        }
        const users=roomUsers.get(roomId);
        users.add(userId);

        socket.to(roomId).emit("user-joined",userId);
        io.to(roomId).emit("users-update",[...users]);
        console.log("EMITTING USERS:",[...users]);
        let room=await Room.findOne({roomId});
        //create room if absent
        if(!room){
            room=await Room.create({roomId,actions:[],redoStack:[]});
        }
        
        console.log("JOIN ROOM:",roomId);

        console.log("LOAD ACTIONS:",room.actions.length);
        console.log(`User ${socket.id} joined room ${roomId}`);
  
        //send old room state
        socket.emit("load-room",room.actions);
    });

    socket.on("cursor-move",({x,y,userId,color,name,avatar})=>{
        socket.to(socket.roomId).emit("cursor-move",{x,y,userId,color,name,avatar});
    });
}