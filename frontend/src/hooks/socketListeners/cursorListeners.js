export default function attachPresenceListeners(socket,setRemoteCursors){
    socket.off("cursor-move");
    socket.off("cursor-remove");

    socket.on("cursor-move",({userId,x,y,color,name,avatar})=>{
        setRemoteCursors((prev)=>({
            ...prev,
            [userId]:{x,y,color,name,avatar}
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