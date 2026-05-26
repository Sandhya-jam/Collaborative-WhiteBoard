import { useEffect,useRef } from "react";
import {socket} from "../socket"

export default function useSocket(addAction,setActions,setRemotePaths,undo,redo,clearCanvas,setUsers,setRemoteCursors,addToast){
    const clearRef=useRef();
    console.log("USESOCKET HOOK RUNNING");
    useEffect(()=>{
        clearRef.current=clearCanvas;
        console.log("USESOCKET EFFECT RUNNING");
        console.log("ATTACHING DRAW-END LISTENER");
        const handleUndo = ({ userId }) => {
            console.log("UNDO RECEIVED ON CLIENT", userId);
            undo(userId);
        };
        socket.off("connect");
        socket.off("draw-action");
        socket.off("draw-start");
        socket.off("draw-move");
        socket.off("draw-end");
        socket.off("undo",handleUndo);
        socket.off("redo");
        socket.off("clear-canvas");
        socket.off("user-joined");
        socket.off("user-left");
        socket.off("disconnect");
        socket.on("connect",()=>{
            console.log("Connected: ",socket.id);
        });

        socket.on("draw-action",(action)=>{
            if(action.type!=="pencil"){
                addAction(action);
            }  
        })
        //START
        socket.on("draw-start",({id,point,color,width})=>{
            setRemotePaths((prev)=>({
                ...prev,
                [id]:{
                    points:[point],
                    color,
                    width
                }
            }));
        });

        //MOVE 
        socket.on("draw-move",({id,point})=>{
            setRemotePaths((prev)=>{
                const path=prev[id];
                if(!path) return prev;

                return{
                    ...prev,
                    [id]:{
                        ...path,
                        points:[...path.points,point]
                    }
                };
            });
        });

        //END 
        socket.on("draw-end",({id})=>{
            console.log("DRAW END RECEIVED FROM:", id);
            setRemotePaths((prev)=>{
                const path=prev[id];
                if(!path) return prev;

                addAction({
                    type:"pencil",
                    points:path.points,
                    color:path.color,
                    width:path.width,
                    userId:id
                });

                const newPaths={...prev};
                delete newPaths[id];

                return newPaths;
            });
        });
        
        socket.on("undo",handleUndo);

        socket.on("redo", ({ userId }) => {
            redo(userId);
        });

        socket.on("clear-canvas",({userId})=>{
            console.log("CLEAR RECEIVED",userId);
            clearRef.current?.(userId);
        });

        socket.on("load-room",(actions)=>{
            console.log("ROOM LOADED",actions.length);
            setActions(actions);
        });

        socket.on("users-update",(users)=>{
            console.log("USERS UPDATE",users);
            setUsers(users);
        })
        
        socket.on("cursor-move",({userId,x,y,color})=>{
            setRemoteCursors((prev)=>({
                ...prev,
                [userId]:{x,y,color}
            }));
        });
        
        socket.on("cursor-remove",(userId)=>{
            setRemoteCursors(prev=>{
                const newCursors={...prev};
                delete newCursors[userId];
                return newCursors;
            });
        });
        
        socket.on("user-joined",(userId)=>{
            addToast(`${userId.slice(0,5)} joined`,"join");
        });

        socket.on("user-left",(userId)=>{
            addToast(`${userId.slice(0,5)} left`,"leave");
        });

        socket.on("disconnect", () => {
            console.log("DISCONNECTED");
        });
        return()=>{
            socket.off("connect");
            socket.off("draw-action");
            socket.off("draw-start");
            socket.off("draw-move");
            socket.off("draw-end");
            socket.off("undo",handleUndo);
            socket.off("redo");
            socket.off("clear-canvas");
            socket.off("user-joined");
            socket.off("user-left");
            socket.off("disconnect");
        };
    },[clearCanvas]);

    const sendAction=(action)=>{
        socket.emit("draw-action",action);
    };

    return {
        socketRef: { current: socket },
        sendAction
  };
}