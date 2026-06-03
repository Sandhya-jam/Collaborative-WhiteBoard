export default function attachPresenceListeners(socket,setRemoteCursors){
    socket.off("cursor-move");
    socket.off("cursor-remove");

    socket.on("cursor-move",({userId,x,y,color,name,avatar})=>{
        const fadeTimeouts = {};
        clearTimeout(fadeTimeouts[userId]);
        setRemoteCursors((prev)=>({
            ...prev,
            [userId]:{x,y,color,name,avatar,faded:false}
        }));
        fadeTimeouts[userId]=setTimeout(()=>{
            setRemoteCursors(prev=>{
                if(!prev[userId]) return prev;
                return {...prev,
                    [userId]:{...prev[userId],faded:true}
                };
            });
        },5000);
    });
    
    socket.on("cursor-remove",(userId)=>{
        setRemoteCursors(prev=>{
            const newCursors={...prev};
            delete newCursors[userId];
            return newCursors;
        });
    });
}