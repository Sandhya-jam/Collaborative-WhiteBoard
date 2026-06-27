import { useState,useRef } from "react";
import {getUserId} from "../utils/userId";
import {hitTest} from "../utils/hitTest";

export default function useCanvas(addAction,color,brushSize,tool,socketRef,sendAction,startText,actions,setActions,selectedId,setSelectedId,
    dragging,setDragging,dragOffset,setDragOffset,resizing,setResizing,addModifyOperation,CurruserId) {
    const [drawing,setDrawing]=useState(false);
    const [currentPath,setCurrentPath]=useState([]);
    const [start,setStart]=useState(null);
    const [preview,setPreview]=useState(null);
    const beforeEditRef=useRef(null);
    const afterEditRef=useRef(null);
    const userId=getUserId();
    const startDrawing=(e)=>{
        const x=e.nativeEvent.offsetX;
        const y=e.nativeEvent.offsetY;
        
        setDrawing(true);
        if(tool==="select"){
            if(selectedId){
                const selected=actions.find(a=>a.id===selectedId);
                if(!selected || selected.userId!==CurruserId) return;
                if(selected){
                    let handleX,handleY;
                    if(selected.type==="rectangle"){
                        handleX=selected.x+selected.width;
                        handleY=selected.y+selected.height;
                    }else if(selected.type==="circle"){
                        handleX=selected.x+selected.radius;
                        handleY=selected.y;
                    }else if(selected.type==="text"){
                        const textWidth=selected.text.length*(selected.width || 20)*0.6;
                        handleX=selected.x+textWidth;
                        handleY=selected.y+(selected.width || 20)/2;
                    }else if(selected.type==="line"){
                        handleX=selected.endX;
                        handleY=selected.endY;
                    }
                    const distance=Math.sqrt((x-handleX)*(x-handleX)+(y-handleY)*(y-handleY));
                    if(distance<50){
                        beforeEditRef.current=structuredClone(selected);
                        setResizing(true);
                        return;
                    }
                }
            }
            const matches=[];
            for(let i=actions.length-1;i>=0;i--){
                if(actions[i].userId!==CurruserId) continue;
                if(hitTest(actions[i],x,y)){
                    matches.push(actions[i]);
                }
            }
            if(matches.length>0){
                const priority={
                    "text":4,
                    "rectangle":3,
                    "circle":2, 
                    "line":1,
                    "pencil":0
                };
                matches.sort((a,b)=>priority[b.type]-priority[a.type]);
                const selected=matches[0];
                beforeEditRef.current=structuredClone(selected);
                setSelectedId(selected.id);
                setDragOffset({x:x-selected.x,y:y-selected.y});
                setDragging(true);
                console.log("Selected action:", selected);
                return;
            }
            setSelectedId(null);
            return;
        }
        if(tool==="pencil"){
            const point={x,y};
            setCurrentPath([point]);
            if (!socketRef?.current) return;
            socketRef.current.emit("draw-start", {
            userId: userId,
            point,
            color,
            width: brushSize
            });
        }
        else if(tool==="text"){
            startText(x,y);
            return;
        }
        else{
            setStart({x,y});
        }
    };

    const draw=(e)=>{
        if(!drawing) return;
        
        //console.log("drawing:", drawing);
        const x=e.nativeEvent.offsetX;
        const y=e.nativeEvent.offsetY;

        if(resizing){
            setActions(prev=>prev.map(action=>{
                if(action.id!==selectedId) return action; 

                let updatedAction=action;
                if(action.type==="rectangle"){
                    updatedAction={
                        ...action,
                        width:x-action.x,
                        height:y-action.y
                    };
                    socketRef.current?.emit("update-object",{
                        id:action.id,
                        updates:{width:x-action.x,height:y-action.y}
                    })
                }else if(action.type==="circle"){
                    const radius=Math.sqrt(Math.pow(x-action.x,2)+Math.pow(y-action.y,2));
                    updatedAction={
                        ...action,
                        radius
                    };
                    socketRef.current?.emit("update-object",{
                        id:action.id,
                        updates:{radius}
                    })
                }else if(action.type==="text"){
                    updatedAction={
                        ...action,
                        width:Math.max(10,x-action.x)
                    };
                    socketRef.current?.emit("update-object",{
                        id:action.id,
                        updates:{width:Math.max(10,x-action.x)}
                    })
                }else if(action.type==="line"){
                    updatedAction={
                        ...action,
                        width:Math.max(10,x-action.x)
                    };
                    socketRef.current?.emit("update-object",{
                        id:action.id,
                        updates:{endX:x,endY:y}
                    })
                }
                afterEditRef.current=structuredClone(updatedAction);
                return updatedAction;
            }));
            return;
        }
        if(tool==="select" && dragging && selectedId){
            const newX = x - dragOffset.x;
            const newY = y - dragOffset.y;
            socketRef.current?.emit("update-object",{
                id:selectedId,
                updates:{x:newX,y:newY}
            });
            setActions(prev=>prev.map(action=>{
                if(action.id!==selectedId) return action;
                const updatedAction = {
                    ...action,
                    x:newX,
                    y:newY
                };
                afterEditRef.current=structuredClone(updatedAction);
                console.log("AFTER EDIT DRAG",{
                    ...action,
                    x:newX,
                    y:newY
                });
                return updatedAction;
            }));
            return;
        }
        if(tool==='pencil'){
            const point={x,y}
            setCurrentPath((prev)=>[...prev,point]);
            if (!socketRef?.current) return;
            socketRef.current.emit("draw-move", {
                userId: userId,
                point
            });
        }else if(start){
            //live preview
            if(tool==="line"){
                setPreview({
                    type:"line",
                    startX:start.x,
                    startY:start.y,
                    endX:x,
                    endY:y,
                    color,
                    strokewidth:brushSize
                });
            }
            if(tool==="rectangle"){
                const rectX=Math.min(start.x,x);
                const rectY=Math.min(start.y,y);
                const rectWidth=Math.abs(x-start.x);
                const rectHeight=Math.abs(start.y-y);

                setPreview({
                    type:"rectangle",
                    x:rectX,
                    y:rectY,
                    width:rectWidth,
                    height:rectHeight,
                    color,
                    strokewidth:brushSize
                });
            }

            if(tool==="circle"){
                const radius=Math.sqrt(Math.pow(x-start.x,2)+Math.pow(y-start.y,2));

                setPreview({
                    type:"circle",
                    x:start.x,
                    y:start.y,
                    radius,
                    color,
                    strokewidth:brushSize
                });
            }
        }
    };

    const stopDrawing = () => {
        if (!drawing) return;
        
        setDrawing(false);
        console.log("Stop drawing triggered")
        let action=null
        if(tool==="select"){
            if(dragging || resizing){
                console.log("BEFORE REF", beforeEditRef.current);
                console.log("AFTER REF", afterEditRef.current);
                if(beforeEditRef.current && afterEditRef.current){
                    addModifyOperation(
                        beforeEditRef.current,
                        afterEditRef.current
                    );
                    socketRef.current?.emit("modify-object",{
                        before:beforeEditRef.current,
                        after:afterEditRef.current
                    });
                    beforeEditRef.current=null;
                    afterEditRef.current=null;
                }
            }
            setDragging(false);
            setResizing(false);
            return;
        }
        if(tool==="pencil"){
        const pencilAction={
            id:crypto.randomUUID(),
            type: "pencil",
            points: currentPath,
            color,
            width: brushSize,
            userId:userId
        };
        addAction(pencilAction);
        if (!socketRef?.current) return;
        console.log("DRAW END",pencilAction);
        socketRef.current.emit("draw-end", {
            action:pencilAction
        });
        }else if(preview){
            action={
                ...preview,
                id:crypto.randomUUID(),
                userId:userId
            };
        }

        if(action){
            addAction(action);//local update
            //console.log("Sending action:", action)
            sendAction(action);//send to server
        }
        setCurrentPath([]);
        setPreview(null);
        setStart(null);
  };
  return {startDrawing,draw,stopDrawing,currentPath,preview};
}