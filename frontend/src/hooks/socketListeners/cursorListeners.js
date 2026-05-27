export default function attachPresenceListeners(socket,setRemoteCursors){
    socket.off("cursor-move");
    socket.off("cursor-remove");

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
}