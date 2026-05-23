import rooms from "../store/roomStore.js";

export function registerDrawingHandlers(socket){
    socket.on("draw-action", (action) => {//for shapes
        rooms[socket.roomId].actions?.push(action);
        rooms[socket.roomId].redoStack=[]
        socket.to(socket.roomId).emit("draw-action", action);
    });
    socket.on("draw-start",(data)=>{
        socket.to(socket.roomId).emit("draw-start",data);
    });

    socket.on("draw-move",(data)=>{
        socket.to(socket.roomId).emit("draw-move",data);
    });

    socket.on("draw-end",(data)=>{//for pencil
        rooms[socket.roomId].actions?.push(data.action);
        rooms[socket.roomId].redoStack=[]
        socket.to(socket.roomId).emit("draw-end",data);
    });
}