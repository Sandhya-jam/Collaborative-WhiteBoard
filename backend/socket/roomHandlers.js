import rooms from "../store/roomStore.js";

export function registerRoomHandlers(socket){
    socket.on("join-room",(roomId)=>{
        socket.join(roomId);
        socket.roomId=roomId;
        console.log(`User ${socket.id} joined room ${roomId}`);
        //create room if absent
        if(!rooms[roomId]){
            rooms[roomId]={
                actions:[],
                redoStack:[]
            };
        }
        //send old room state
        socket.emit("load-room",rooms[roomId].actions);
    });
}