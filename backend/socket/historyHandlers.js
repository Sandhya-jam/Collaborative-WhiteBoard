import rooms from "../store/roomStore.js";

export function registerHistoryHandlers(socket){
    socket.on("undo",({userId})=>{
        const room=rooms[socket.roomId];
        if(room){
            for(let i=room.actions.length-1;i>=0;i--){
                if(room.actions[i]?.userId===userId){
                    const removedAction=room.actions[i];
                    room.redoStack.push(removedAction);
                    room.actions.splice(i,1);
                    break;
                }
            }
        }
        console.log("undo received on server")
        socket.to(socket.roomId).emit("undo",{userId});
    })
    
    socket.on("redo",({userId})=>{
        const room=rooms[socket.roomId];
        if(room && room.redoStack.length>0){
            for(let i=room.redoStack.length-1;i>=0;i--){
                if(room.redoStack[i]?.userId===userId){
                    const restoredAction=room.redoStack[i];
                    room.actions.push(restoredAction);
                    room.redoStack.splice(i,1);
                    socket.to(socket.roomId).emit("redo",{userId});
                    break;
                };
            }
        }
    })

    socket.on("clear-canvas",({userId})=>{
        console.log("SERVER GOT CLEAR",userId);
        const room=rooms[socket.roomId];
        if(room){
            room.actions=room.actions.filter(action=>action.userId!==userId);
            room.redoStack=room.redoStack.filter(action=>action.userId!==userId);
        }
        socket.to(socket.roomId).emit("clear-canvas",{userId});
    })
};