import { useState } from "react";
import {getUserId} from "../utils/userId";
export default function useCanvas(addAction,color,brushSize,tool,socketRef,sendAction){
    const [drawing,setDrawing]=useState(false);
    const [currentPath,setCurrentPath]=useState([]);
    const [start,setStart]=useState(null);
    const [preview,setPreview]=useState(null);
    
    const userId=getUserId();
    const startDrawing=(e)=>{
        const x=e.nativeEvent.offsetX;
        const y=e.nativeEvent.offsetY;
        
        setDrawing(true);
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
        }else{
            setStart({x,y});
        }
    };

    const draw=(e)=>{
        if(!drawing) return;
        
        //console.log("drawing:", drawing);
        const x=e.nativeEvent.offsetX;
        const y=e.nativeEvent.offsetY;

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
        if(tool==="pencil"){
        const pencilAction={
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