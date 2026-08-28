export default function attachDrawingListeners(socket,addAction,setActions,setRemotePaths,undoRef,
    redoRef,clearRef,setHistory,setRedoHistory,addModifyOperation,roomLoaded,loadingRoom,roomVersion,setRoomVersion,
    roomVersionRef,pendingOperationRef){
    socket.off("draw-action");
    socket.off("draw-start");
    socket.off("draw-move");
    socket.off("draw-end");
    socket.off("undo");
    socket.off("redo");
    socket.off("clear-canvas");
    socket.off("load-room");
    socket.off("persist-success");
    socket.off("update-object");
    socket.on("draw-action",(action)=>{
        if(action.type!=="pencil"){
            addAction(action);
        }  
    })
    //START
    socket.on("draw-start",({userId,point,color,width})=>{
        setRemotePaths((prev)=>({
            ...prev,
            [userId]:{
                points:[point],
                color,
                width
            }
        }));
    });

    //MOVE 
    socket.on("draw-move",({userId,point})=>{
        setRemotePaths((prev)=>{
            const path=prev[userId];
            if(!path) return prev;

            return{
                ...prev,
                [userId]:{
                    ...path,
                    points:[...path.points,point]
                }
            };
        });
    });

    //END 
    socket.on("draw-end",({action,version})=>{
        console.log("DRAW END RECEIVED:", action,"version",version);
        addAction(action);
        if(version!==undefined){
            roomVersionRef.current = version;
            setRoomVersion(version);
        }
        setRemotePaths((prev)=>{
            const newPaths={...prev};
            delete newPaths[action.userId];
            return newPaths;
        });
    });
    
    socket.on("undo",({ userId }) => {
        console.log("UNDO RECEIVED ON CLIENT", userId);
        undoRef.current?.(userId);
    });

    socket.on("redo", ({ userId }) => {
        redoRef.current?.(userId);
    });

    socket.on("clear-canvas",({userId})=>{
        console.log("CLEAR RECEIVED",userId);
        clearRef.current?.(userId);
    });

    socket.on("load-room",({actions,history,redoHistory,version})=>{
        console.log("ROOM LOADED",actions.length);
        console.log("ROOM VERSION:", version);
        loadingRoom.current = true;

        const pending=[...pendingOperationRef.current];
        const pendingCreateActions=pending.filter(op=>op.type==="create").map(op=>op.payload);
        setActions([...actions,...pendingCreateActions]);
        setHistory(history || []);
        setRedoHistory(redoHistory || []);
        roomVersionRef.current = version;
        setRoomVersion(version);
        roomLoaded.current = true;
        
        setTimeout(() => {
            loadingRoom.current = false;
        }, 0);
    });

    socket.on("room-sync-ready",({version})=>{
        console.log("room sync ready,version:",version);
        roomVersionRef.current = version;
        setRoomVersion(version);
        const pending=[...pendingOperationRef.current];
        if(pending.length==0){
            console.log("NO PENDING OPERATIONS");
            return;
        }
        console.log("SENDING PENDING OPERATIONS:",pending.length);
        socket.emit("sync-operation",{operations:pending});
    });

    socket.on("operation-applied",({operationId,version})=>{
        console.log("Operation applied:",operationId,"version:",version);
        pendingOperationRef.current = pendingOperationRef.current.filter(op=>op.id!==operationId);
        roomVersionRef.current = version;
        setRoomVersion(version);
    });

    socket.on("persist-success",({version})=>{
        console.log("PERSIST SUCCESS, NEW VERSION:",version);
        roomVersionRef.current = version;
        setRoomVersion(version);
    });

    socket.on("update-object",({id,updates})=>{
        console.log("CLIENT RECEIVED UPDATE",id,updates);
            if(updates.width){

            console.log(
                "RECEIVED RECT UPDATE",
                updates
            );
        }
        // console.log("SETACTIONS EXISTS?", setActions);
        setActions(prev=>prev.map(action=>action.id===id?{...action,...updates}:action));
    });

    socket.on("modify-object",({before,after})=>{
        console.log("Remote Modify",before.id);
        addModifyOperation(before,after);
    })
};