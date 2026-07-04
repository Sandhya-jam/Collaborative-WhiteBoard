import Room from "../models/Room.js";
import {roomUsers} from "../store/presenceStore.js";

export function registerRoomHandlers(socket,io){
    socket.on("join-room",async({roomId,userId,name,email})=>{
        socket.join(roomId);
        socket.roomId=roomId;
        socket.userId=userId;
        // Add user to the room
        if (!roomUsers.has(roomId)) {
            roomUsers.set(roomId, new Map());
        }
        const users=roomUsers.get(roomId);
        if(!users.has(userId)){
            users.set(userId,{
                userId,
                name,
                email,
                sockets:new Set()
            });
        }
        users.get(userId).sockets.add(socket.id);

        socket.to(roomId).emit("user-joined",userId);
        io.to(roomId).emit("users-update",[...users.values()].map(user=>({
            userId:user.userId,
            name:user.name,
            email:user.email,
        })));
        // console.log("EMITTING USERS:",[...users.keys()]);
        let room=await Room.findOne({roomId});
        //create room if absent
        if(!room){
            room=await Room.create({roomId,actions:[],history:[],redoHistory:[]});
        }
        
        console.log("JOIN ROOM:",roomId);

        console.log("LOAD ACTIONS:",room.actions.length);
        console.log(`User ${socket.id} joined room ${roomId}`);
  
        //send old room state
        socket.emit("load-room",{
            actions:room.actions,
            history:room.history,
            redoHistory:room.redoHistory
        });
    });

    socket.on("cursor-move",({x,y,userId,color,name,avatar})=>{
        socket.to(socket.roomId).emit("cursor-move",{x,y,userId,color,name,avatar});
    });

    socket.on("emoji-reaction", ({ userId, emoji,name }) => {
        console.log("Emoji received:", userId, emoji);
        socket.to(socket.roomId).emit("emoji-reaction", {userId,emoji,name});
    });
}