import Room from "../models/Room.js";

export function registerDrawingHandlers(socket){
    socket.on("draw-action", async(action) => {//for shapes
        socket.to(socket.roomId).emit("draw-action", action);
    });
    socket.on("draw-start",(data)=>{
        socket.to(socket.roomId).emit("draw-start",data);
    });

    socket.on("draw-move",(data)=>{
        socket.to(socket.roomId).emit("draw-move",data);
    });

    socket.on("draw-end",async(data)=>{//for pencil
        socket.to(socket.roomId).emit("draw-end",data);
    });

    socket.on("update-object",async({id,updates})=>{
        console.log("SERVER RECEIVED",id,updates);
        socket.to(socket.roomId).emit("update-object",{id,updates});
    });

    socket.on("modify-object",({before,after})=>{
        socket.to(socket.roomId).emit("modify-object",
            {
                before,
                after
            }
        );
    });

    socket.on("persist-object",async({actions,history,redoHistory})=>{
        await Room.findOneAndUpdate(
            {roomId:socket.roomId},
            {
                actions,
                history,
                redoHistory
            },
        );
        console.log("ROOM PERSISTED");
    });
}