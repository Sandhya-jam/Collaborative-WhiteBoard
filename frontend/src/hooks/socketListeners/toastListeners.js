export default function attachToastListeners(socket,addToast,peerConnections,){
    socket.off("user-joined");
    socket.off("user-left");

    socket.on("user-joined",(userId)=>{
        addToast(`${userId.slice(0,5)} joined`,"join");
    });

    socket.on("user-left",(userId)=>{
        addToast(`${userId.slice(0,5)} left`,"leave");
        console.log("User Left:",userId);
        const pc=peerConnections.current[userId];
        if(!pc) return;
        pc.close();
        delete peerConnections.current[userId];
        //remoteAudioRef.current.srcObject=null;
        console.log("PeerConnection cleaned")
    });
}