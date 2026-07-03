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
                const opUser=operation.operation==="modify"
                ?operation.before.userId:operation.operation==="create"?
                operation.object.userId:operation.objects[0].userId;

                if(opUser!==userId) continue;

                const newHistory=[...prevHistory];
                const removedOp=newHistory.splice(i,1)[0];
                console.log("UNDO OPERATION", removedOp);
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
                }else if(removedOp.operation==="clear"){
                    setActions(prev=>[
                        ...prev,
                        ...structuredClone(operation.objects)
                    ])
                }
                return newHistory;
            }
            return prevHistory;
        })
    },[]);
    
    const redo=useCallback((userId)=>{
        setRedoHistory(prevRedo=>{
            for(let i=prevRedo.length-1;i>=0;i--){
                const op=prevRedo[i];
                const opUser=op.operation==="modify"
                ?op.before.userId:op.operation==="create"?
                op.object.userId:op.objects.userId;

                if(opUser!==userId) continue;

                const newRedo=[...prevRedo]
                const redoOper=newRedo.splice(i,1)[0];

                setHistory(prev=>[
                    ...prev,
                    redoOper
                ]);

                if(redoOper.operation==="create"){
                    setActions(prev=>[
                        ...prev,
                        structuredClone(redoOper.object)
                    ]);
                }else if(redoOper.operation==="modify"){
                    setActions(prev=>
                        prev.map(action=>
                            action.id===redoOper.after.id
                            ?structuredClone(redoOper.after):action
                        )
                    );
                }else if(redoOper.operation==="clear"){
                    const userId=redoOper.objects[0].userId;
                    setActions(prev=>
                        prev.filter(action=>action.userId!==userId)
                    );
                }
                return newRedo;
            }
            return prevRedo;
        })
    },[]);
    
    const clearCanvas=useCallback((userId)=>{
        console.log("CLEAR FN CALLED");
        // if(actions.length==0) return;
        setActions(prev=>{
            const removeObj=prev.filter(
                action=>action.userId===userId
            );
            if(removeObj.length===0) return prev;
            setHistory(history=>[
                ...history,
                {
                    operation:"clear",
                    objects:structuredClone(removeObj)
                }
            ]);
            setRedoHistory([]);
            return prev.filter(
                action=>action.userId!==userId
            );
        });
    });

  return{actions,setActions,addAction,undo,redo,clearCanvas,
    history,setHistory,addModifyOperation,redoHistory,setRedoHistory}
}