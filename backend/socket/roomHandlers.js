import Room from "../models/Room.js";

export function registerRoomHandlers(socket){
    socket.on("join-room",async(roomId)=>{
        socket.join(roomId);
        socket.roomId=roomId;
        
        let room=await Room.findOne({roomId});
        //create room if absent
        if(!room){
            room=await Room.create({roomId,actions:[],redoStack:[]});
        }
        
        console.log(`User ${socket.id} joined room ${roomId}`);
  
        //send old room state
        socket.emit("load-room",room.actions);
    });
}