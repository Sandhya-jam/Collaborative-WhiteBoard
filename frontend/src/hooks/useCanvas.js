import { useState } from "react";
import {getUserId} from "../utils/userId";
import {hitTest} from "../utils/hitTest";

export default function useCanvas(addAction,color,brushSize,tool,socketRef,sendAction,startText,actions,setActions,selectedId,setSelectedId,dragging,setDragging,dragOffset,setDragOffset,resizing,setResizing) {
    const [drawing,setDrawing]=useState(false);
    const [currentPath,setCurrentPath]=useState([]);
    const [start,setStart]=useState(null);
    const [preview,setPreview]=useState(null);

    const userId=getUserId();
    const startDrawing=(e)=>{
        const x=e.nativeEvent.offsetX;
        const y=e.nativeEvent.offsetY;
        
        setDrawing(true);
        if(tool==="select"){
            if(selectedId){
                const selected=actions.find(a=>a.id===selectedId);
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
                        setResizing(true);
                        return;
                    }
                }
            }
            for(let i=actions.length-1;i>=0;i--){
                if(hitTest(actions[i],x,y)){
                    setSelectedId(actions[i].id);
                    setDragOffset({x:x-actions[i].x,y:y-actions[i].y});
                    setDragging(true);
                    console.log("selected",actions[i]);
                    return;
                }
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
                if(action.type==="rectangle"){
                    return{
                        ...action,
                        width:x-action.x,
                        height:y-action.y
                    };
                }else if(action.type==="circle"){
                    const radius=Math.sqrt(Math.pow(x-action.x,2)+Math.pow(y-action.y,2));
                    return{
                        ...action,
                        radius
                    };
                }else if(action.type==="text"){
                    return{
                        ...action,
                        width:Math.max(10,x-action.x)
                    };
                }else if(action.type==="line"){
                    return{
                        ...action,
                        endX:x,
                        endY:y
                    };
                }
            }));
            return;
        }
        if(tool==="select" && dragging && selectedId){
            setActions(prev=>prev.map(action=>{
                if(action.id!==selectedId) return action;
                return{
                    ...action,
                    x:x-dragOffset.x,
                    y:y-dragOffset.y
                };
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