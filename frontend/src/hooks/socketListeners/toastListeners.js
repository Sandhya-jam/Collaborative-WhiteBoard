export default function attachToastListeners(socket,addToast,peerConnections,){
    socket.off("user-joined");
    socket.off("user-left");

    socket.on("user-joined", ({ name }) => {
        addToast(`${name} joined`, "join");
    });

    socket.on("user-left",({name})=>{
        addToast(`${name} left`,"leave");
        console.log("User Left:",userId);
        const pc=peerConnections.current[userId];
        if(!pc) return;
        pc.close();
        delete peerConnections.current[userId];
        //remoteAudioRef.current.srcObject=null;
        console.log("PeerConnection cleaned")
    });
}