import { useState } from "react";

export default function useHistory(){
    const [actions,setActions]=useState([]);
    const [redoStack,setRedoStack]=useState([]);

    const addAction=(action)=>{
        setActions((prev)=>[...prev,action]);
        setRedoStack([]);
    }

    const undo=(userId)=>{
        setActions((prev)=>{
            for(let i=prev.length-1;i>=0;i--){
                if(prev[i].userId===userId){
                    const newActions=[...prev];
                    const removed=newActions.splice(i,1)[0];

                    setRedoStack(r=>[...r,removed]);

                    return newActions;
                }
            }
            return prev;
        });
    };
    
    const redo=()=>{
        setRedoStack((prev)=>{
            
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