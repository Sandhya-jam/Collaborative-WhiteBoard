import Room from "../models/Room.js";

export function registerHistoryHandlers(socket){
    socket.on("undo",async({userId})=>{
        console.log("undo received on server")
        socket.to(socket.roomId).emit("undo",{userId});
    })
    
    socket.on("redo",async({userId})=>{
        socket.to(socket.roomId).emit("redo",{userId});
    })

    socket.on("clear-canvas",async({userId})=>{
        console.log("SERVER GOT CLEAR",userId);
        socket.to(socket.roomId).emit("clear-canvas",{userId});
    })
};