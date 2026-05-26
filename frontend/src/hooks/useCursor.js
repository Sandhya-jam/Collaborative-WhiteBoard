import {getUserColor} from "../utils/userColor";
const useCursor = (socketRef,userId) => {

    const sendCursor=(e)=>{
        if(!socketRef.current) return;
        socketRef.current.emit("cursor-move",{
            userId,
            x:e.clientX,
            y:e.clientY,
            color:getUserColor(userId)
        });
    };

  return {
    sendCursor
 }; 
}

export default useCursor