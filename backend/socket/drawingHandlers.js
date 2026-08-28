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

    socket.on("draw-end",async({action,version})=>{//for pencil
        console.log("Operation Received:",action.id,"version:",version);
        socket.to(socket.roomId).emit("draw-end",{action,version});
    });

    socket.on("sync-operation",async({operations})=>{
        try{
            console.log("SYNC OPERATIONS RECEIVED:",operations.length);
            for(const operation of operations){
                const room=await Room.findOne({roomId:socket.roomId});
                if(!room) return;
                if(operation.type!=="create") return;
                const action=operation.payload;
                const alreadyExists=room.actions.some(a=>a.id===action.id);
                if(alreadyExists){
                    socket.to(socket.roomId).emit("operation-applied",{operationId:operation.id,version:room.version});
                    return;
                }
                room.actions.push(action);
                room.version+=1;
                await room.save();
                socket.to(socket.roomId).emit("draw-end",{action,version:room.version});
                socket.to(socket.roomId).emit("operation-applied",{operationId:operation.id,version:room.version});
            }
        }catch(err){
            console.error("ERROR SYNCING OPERATIONS:",err);
        }
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

    socket.on("persist-object",async({actions,history,redoHistory,version})=>{
        try{
            //console.log("Persist operation:",operation?.id,"version:",version,"baseVersion:",operation?.baseVersion);
            const room=await Room.findOneAndUpdate(
                {
                    roomId:socket.roomId,
                    version:version
                },
                {
                    actions,
                    history,
                    redoHistory,
                    $inc:{version:1}
                },{
                    new:true
                }
            );
            if(!room){
                console.log("STALE ROOM VERSION, NOT PERSISTING");
                const latestRoom=await Room.findOne({roomId:socket.roomId});
                socket.to(socket.roomId).emit("load-room",{
                    actions:latestRoom.actions,
                    history:latestRoom.history,
                    redoHistory:latestRoom.redoHistory,
                    version:latestRoom.version
                });
                return;
            }
            console.log("ROOM PERSISTED, NEW VERSION:",room.version);
            socket.to(socket.roomId).emit("persist-success",{version:room.version});
        }catch(err){
            console.error("ERROR PERSISTING ROOM:",err);
        }
    });
}