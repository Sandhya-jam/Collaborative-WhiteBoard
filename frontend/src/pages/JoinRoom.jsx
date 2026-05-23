import { useState} from "react";
import {useNavigate} from "react-router-dom"

const JoinRoom = () => {
    const [roomId,setRoomId]=useState("");
    const navigate=useNavigate();

    const handleJoin=()=>{
        if(!roomId.trim()) return;

        navigate(`/room/${roomId}`);
    };

  return (
    <div className="h-scree flex flex-col justify-center items-center gap-4">
        <h1 className="text-3xl font-bold">
            Join Whiteboard Room 
        </h1>
        <input 
        type="text"
        placeholder="Enter Room Id"
        value={roomId}
        onChange={(e)=>setRoomId(e.target.value)
        } 
        className="boreder p-2 rounded w-72"
        />

        <button 
        onClick={handleJoin}
        className="bg-blue-500 text-white px-4 py-2 rounded">
        Join Room
        </button>
    </div>
  );
}

export default JoinRoom