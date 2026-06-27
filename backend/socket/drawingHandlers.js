import Room from "../models/Room.js";

export function registerDrawingHandlers(socket){
    socket.on("draw-action", async(action) => {//for shapes
        const room=await Room.findOne({roomId:socket.roomId});
        if(!room){
            console.log("ROOM NOT FOUND",socket.roomId);
            return;
        }
        room?.actions?.push(action);
        room?.redoStack?.push(action);
        await room.save();
        socket.to(socket.roomId).emit("draw-action", action);
    });
    socket.on("draw-start",(data)=>{
        socket.to(socket.roomId).emit("draw-start",data);
    });

    socket.on("draw-move",(data)=>{
        socket.to(socket.roomId).emit("draw-move",data);
    });

    socket.on("draw-end",async(data)=>{//for pencil
        const room=await Room.findOne({roomId:socket.roomId});
        if(!room){
            console.log("ROOM NOT FOUND",socket.roomId);
            return;
        }
        room?.actions?.push(data.action);
        room.redoStack=[]
        await room.save();
        socket.to(socket.roomId).emit("draw-end",data);
    });

    socket.on("update-object",async({id,updates})=>{
        console.log("SERVER RECEIVED",id,updates);
        socket.to(socket.roomId).emit("update-object",{id,updates});
    });

    socket.on("persist-object",async({id,updates})=>{
        const room =await Room.findOne({roomId:socket.roomId});
        room.actions=room.actions.map(action=>action.id===id?{...action,...updates}:action);
        room.redoStack=room.redoStack?.push(...room.actions.filter(action=>action.id===id));
        await room.save();
    });
}