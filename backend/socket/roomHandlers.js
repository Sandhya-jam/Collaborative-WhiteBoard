import Room from "../models/Room.js";
import {roomUsers} from "../store/presenceStore.js";

export function registerRoomHandlers(socket,io){
    socket.on("join-room",async({roomId,userId,name,email,micOn,version})=>{
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
                micOn:micOn || false,
                sockets:new Set()
            });
        }
        users.get(userId).sockets.add(socket.id);

        socket.to(roomId).emit("user-joined",{name:users.get(userId).name});
        io.to(roomId).emit("users-update",[...users.values()].map(user=>({
            userId:user.userId,
            name:user.name,
            email:user.email,
        })));
        
        let room=await Room.findOne({roomId});
        //create room if absent
        if(!room){
            room=await Room.create({roomId,actions:[],history:[],redoHistory:[]});
        }
        console.log(
            "RECONNECT/JOIN VERSION:",
            "client:", version,
            "server:", room.version
        );

        console.log("LOAD ACTIONS:",room.actions.length);
        console.log(`User ${socket.id} joined room ${roomId}`);
  
        //send old room state
        if(version ===null || version === undefined || version <room.version){
            if(version !== null && version !== undefined){
                console.log("STALE VERSION, SENDING LATEST");
            }   
            socket.emit("load-room",{
                actions:room.actions,
                history:room.history,
                redoHistory:room.redoHistory,
                version:room.version
            });
        }else if(version===room.version){
            console.log("UP TO DATE, NO LOAD");
        }
        socket.to(roomId).emit("room-sync-ready",{version:room.version});
    });

    socket.on("cursor-move",({x,y,userId,color,name,avatar})=>{
        socket.to(socket.roomId).emit("cursor-move",{x,y,userId,color,name,avatar});
    });

    socket.on("emoji-reaction", ({ userId, emoji,name }) => {
        console.log("Emoji received:", userId, emoji);
        socket.to(socket.roomId).emit("emoji-reaction", {userId,emoji,name});
    });

    socket.on("voice-offer",({targetUserId,senderUserId,offer})=>{
        const users=roomUsers.get(socket.roomId);
        const targetUser=users.get(targetUserId);
        targetUser?.sockets?.forEach(socketId=>{
            io.to(socketId).emit("voice-offer",{
                senderUserId,
                offer
            });
        });
    });

    socket.on("voice-answer",({targetUserId,senderUserId,answer})=>{
        const users=roomUsers.get(socket.roomId);
        if(!users) return;
        const targetUser=users.get(targetUserId);
        if(!targetUser) return;

        targetUser?.sockets?.forEach(socketId=>{
            io.to(socketId).emit("voice-answer",{
                senderUserId,
                answer
            });
        });
    });

    socket.on("ice-candidate",({targetUserId,senderUserId,candidate})=>{
        const users=roomUsers.get(socket.roomId)
        if(!users) return;

        const targetUser=users.get(targetUserId);
        if(!targetUser) return;

        targetUser.sockets.forEach(socketId=>{
            io.to(socketId).emit("ice-candidate",{senderUserId,candidate});
        })
    });

    socket.on("mic-status",({micOn})=>{
        const users=roomUsers.get(socket.roomId);
        if(!users) return;
        const user=users.get(socket.userId);
        if(!user) return;

        user.micOn=micOn;
        io.to(socket.roomId).emit("mic-status-update",{
            userId:socket.userId,
            micOn
        });
    });
}