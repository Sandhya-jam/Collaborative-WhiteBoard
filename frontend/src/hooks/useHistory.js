import { useCallback, useState,useEffect, act} from "react";

export default function useHistory(){
    const [actions,setActions]=useState([]);
    const [redoStack,setRedoStack]=useState([]);
    const [history,setHistory]=useState([]);
    const [redoHistory,setRedoHistory]=useState([]);
    const addAction=(action)=>{
        setActions((prev)=>[...prev,action]);
        setHistory(prev=>[
            ...prev,
            {
                operation:"create",
                object:structuredClone(action)
            }
        ]);
        setRedoHistory([]);
        setRedoStack([]);
    }

    const addModifyOperation=(before,after)=>{
        setHistory(prev=>[
            ...prev,
            {
                operation:"modify",
                before:structuredClone(before),
                after:structuredClone(after)
            }
        ]);
        setRedoHistory([]);
    };

    const undo=useCallback((userId)=>{
        console.log("UNDO CALLED ON CLIENT:", userId);
        setHistory(prevHistory=>{
            for(let i=prevHistory.length-1;i>=0;i--){
                const operation=prevHistory[i];
                const opUser=operation.operation==="create"
                ? operation.object.userId:operation.before.userId;

                if(opUser!==userId) continue;

                const newHistory=[...prevHistory];
                const removedOp=newHistory.splice(i,1)[0];

                setRedoHistory(prev=>[
                    ...prev,
                    removedOp
                ]);

                if(removedOp.operation==="create"){
                    setActions(prev=>
                        prev.filter(action=>
                            action.id!==removedOp.object.id
                        )
                    );
                }else if(removedOp.operation==="modify"){
                    setActions(prev=>
                        prev.map(action=>
                            action.id===removedOp.before.id
                            ?structuredClone(removedOp.before):action
                        )
                    );
                }
                return newHistory;
            }
            return prevHistory;
        })
    },[]);
    
    const redo=useCallback((userId)=>{
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
    },[]);
    
    const clearCanvas=useCallback((userId)=>{
        console.log("CLEAR FN CALLED");
        // if(actions.length==0) return;
    
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
    },[]);

  return{actions,setActions,addAction,undo,redo,clearCanvas,
    history,addModifyOperation,redoHistory,setRedoHistory}
}