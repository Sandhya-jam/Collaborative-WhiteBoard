import { useEffect,useRef } from "react";
import {io} from "socket.io-client"

export default function useSocket(addAction,setRemotePaths,undo,redo){
    const socketRef=useRef(null)

    useEffect(()=>{
        socketRef.current=io("http://localhost:5000");

        socketRef.current.on("connect",()=>{
            console.log("Connected: ",socketRef.current.id);
        });

        socketRef.current.on("draw-action",(action)=>{
            addAction(action);
        })
        //START
        socketRef.current.on("draw-start",({id,point,color,width})=>{
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
        socketRef.current.on("draw-move",({id,point})=>{
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
        socketRef.current.on("draw-end",({id})=>{
            setRemotePaths((prev)=>{
                const path=prev[id];
                if(!path) return prev;

                addAction({
                    type:"pencil",
                    points:path.points,
                    color:path.color,
                    width:path.width
                });

                const newPaths={...prev};
                delete newPaths[id];

                return newPaths;
            });
        });

        socketRef.current.on("undo", ({ userId }) => {
            console.log("UNDO RECEIVED ON CLIENT", userId);
            undo(userId)
        });

        socketRef.current.on("redo", ({ userId }) => {
            redo(userId);
        });
        return()=>{
            socketRef.current.disconnect();
        };
    },[]);

    const sendAction=(action)=>{
        socketRef.current.emit("draw-action",action);
    };

    return {socketRef,sendAction};
}