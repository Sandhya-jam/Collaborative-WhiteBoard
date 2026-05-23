import { useState } from "react";

export default function useHistory(){
    const [actions,setActions]=useState([]);
    const [redoStack,setRedoStack]=useState([]);

    const addAction=(action)=>{
        setActions((prev)=>[...prev,action]);
        setRedoStack([]);
    }

    const undo=(userId)=>{
        console.log("UNDO CALLED ON CLIENT:", userId);
        setActions((prev)=>{
            console.log("BEFORE:", prev);
            for(let i=prev.length-1;i>=0;i--){
                if(prev[i].userId===userId){
                    //console.log("REMOVING:", prev[i]);
                    const newActions=[...prev];
                    const removed=newActions.splice(i,1)[0];

                    setRedoStack(r=>[...r,removed]);
                    //console.log("AFTER:", newActions);
                    return newActions;
                }
            }
            //console.log("NO MATCH FOUND ❌");
            return prev;
        });
    };
    
    const redo=(userId)=>{
        setRedoStack((prev)=>{
            if(prev.length===0) return prev;

            for(let i=prev.length-1;i>=0;i--){
                if(prev[i].userId===userId){
                    const action=prev[i];
                    setActions(a=>[...a,action]);
                    const newRedo=[...prev];
                    newRedo.splice(i,1);
                    return newRedo;
                }
            }
            return prev;
        });
    };
    
    const clearCanvas=(userId)=>{
        console.log("CLEAR FN CALLED");
        if(actions.length==0) return;
    
        setActions(prev => {
            console.log("BEFORE CLEAR:", prev);

            const filtered =
                prev.filter(
                    action =>
                        action.userId !== userId
                );

            console.log(
                "AFTER CLEAR:",
                filtered
            );

            return filtered;
        });
    };

  return{actions,addAction,undo,redo,clearCanvas}
}