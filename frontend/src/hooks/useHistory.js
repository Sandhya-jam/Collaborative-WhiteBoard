import { useState } from "react";

export default function useHistory(){
    const [actions,setActions]=useState([]);
    const [redoStack,setRedoStack]=useState([]);

    const addAction=(action)=>{
        setActions((prev)=>[...prev,action]);
        setRedoStack([]);
    }

    const undo=()=>{
        setActions((prev)=>{
            if(prev.length===0) return prev;
            const last=prev[prev.length-1];
            setRedoStack((r)=>[...r,last])
            return prev.slice(0,-1);
        });
    };

    const redo=()=>{
        setRedoStack((prev)=>{
            if(prev.length===0) return prev;
            const last=prev[prev.length-1];
            setActions((a)=>[...a,last])
            return prev.slice(0,-1);
        });
    };

    const clearCanvas=()=>{
        if(actions.length==0) return;

        if(confirm("Clear the board??")){
            setActions([]);
            setRedoStack([]);
        }
    };

  return{actions,addAction,undo,redo,clearCanvas}
}