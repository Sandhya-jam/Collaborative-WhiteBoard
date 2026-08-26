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

    socket.on("draw-end",async({action})=>{//for pencil
        console.log("Operation Received:",action.id,"baseVersion:",action.baseVersion);
        socket.to(socket.roomId).emit("draw-end",{action});
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