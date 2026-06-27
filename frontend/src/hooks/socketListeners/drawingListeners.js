export default function attachDrawingListeners(socket,addAction,setActions,setRemotePaths,undoRef,
    redoRef,clearRef,setHistory,setRedoHistory,addModifyOperation){
    socket.off("draw-action");
    socket.off("draw-start");
    socket.off("draw-move");
    socket.off("draw-end");
    socket.off("undo");
    socket.off("redo");
    socket.off("clear-canvas");
    socket.off("load-room");
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
    socket.on("draw-end",({action})=>{
        console.log("DRAW END RECEIVED:", action);
        addAction(action);
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

    socket.on("load-room",({actions,history,redoHistory})=>{
        console.log("ROOM LOADED",actions.length);
        setActions(actions);
        setHistory(history||[])
        setRedoHistory(redoHistory||[])
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