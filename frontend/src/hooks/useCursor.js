import {getUserColor} from "../utils/userColor";

const useCursor = (socketRef,userId,profile) => {
    const sendCursor=(e)=>{
        if(!socketRef.current) return;
        socketRef.current.emit("cursor-move",{
            userId,
            x:e.clientX,
            y:e.clientY,
            color:getUserColor(userId),
            name:profile.name,
            avatar:profile.avatar
        });
    };

  return {
    sendCursor
 }; 
}

export default useCursor