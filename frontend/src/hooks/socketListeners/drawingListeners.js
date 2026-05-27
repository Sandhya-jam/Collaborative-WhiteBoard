export default function attachDrawingListeners(socket,addAction,setActions,setRemotePaths,undoRef,redoRef,clearRef){
    socket.off("draw-action");
    socket.off("draw-start");
    socket.off("draw-move");
    socket.off("draw-end");
    socket.off("undo");
    socket.off("redo");
    socket.off("clear-canvas");
    socket.off("load-room");

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

    socket.on("load-room",(actions)=>{
        console.log("ROOM LOADED",actions.length);
        setActions(actions);
    });
}