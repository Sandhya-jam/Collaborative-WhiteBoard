import { useEffect,useRef } from "react";
import {socket} from "../socket"
import { getUser } from "../utils/auth";
import attachDrawingListeners from "./socketListeners/drawingListeners";
import attachPresenceListeners from "./socketListeners/presenceListeners";
import attachCursorListeners from "./socketListeners/cursorListeners";
import attachToastListeners from "./socketListeners/toastListeners";

export default function useSocket(addAction,setActions,setRemotePaths,undo,redo,clearCanvas,users,setUsers,
    setRemoteCursors,addToast,setHistory,setRedoHistory,addModifyOperation,createPeerConnection,peerConnections,
    createOffer,createAnswer,micOn,remoteAudioRef){
    const clearRef=useRef();
    const undoRef=useRef();
    const redoRef=useRef();
    const reactionTimeouts = useRef({});
    const negotiationStarted = useRef(false);
    //console.log("USESOCKET HOOK RUNNING");
    useEffect(()=>{
        clearRef.current=clearCanvas;
        undoRef.current=undo;
        redoRef.current=redo;
        // console.log("USESOCKET EFFECT RUNNING");
        // console.log("ATTACHING DRAW-END LISTENER");
        socket.off("connect"); 
        socket.off("disconnect");

        socket.on("connect",()=>{
            console.log("Connected: ",socket.id);
        });

        attachDrawingListeners(socket,addAction,setActions,setRemotePaths,undoRef,redoRef,clearRef,
            setHistory,setRedoHistory,addModifyOperation);
        attachPresenceListeners(socket,setUsers,createPeerConnection,peerConnections,createOffer,createAnswer,remoteAudioRef);
        attachCursorListeners(socket,setRemoteCursors,reactionTimeouts);
        attachToastListeners(socket,addToast,peerConnections);

        socket.on("disconnect", () => {
            console.log("DISCONNECTED");
        });
        return()=>{
            console.log("CLEANING UP SOCKET LISTENERS");
            socket.off("connect"); 
            socket.off("draw-action");
            socket.off("draw-start");
            socket.off("draw-move");
            socket.off("draw-end");
            socket.off("update-object");
            socket.off("undo");
            socket.off("redo");
            socket.off("clear-canvas");
            socket.off("load-room");
            socket.off("users-update");
            socket.off("cursor-move");
            socket.off("cursor-remove");
            socket.off("user-joined");
            socket.off("user-left");
            socket.off("voice-offer");
            socket.off("disconnect");
        };
    },[]);

    const sendAction=(action)=>{
        socket.emit("draw-action",action);
    };

    return {
        socketRef: { current: socket },
        sendAction
  };
}