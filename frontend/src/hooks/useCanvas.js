import { useState } from "react";

export default function useCanvas(addAction,color,brushSize){
    const [drawing,setDrawing]=useState(false);
    const [currentPath,setCurrentPath]=useState([]);

    const startDrawing=(e)=>{
        const x=e.nativeEvent.offsetX;
        const y=e.nativeEvent.offsetY;
        
        setDrawing(true);
        setCurrentPath([{x,y}])
    };

    const draw=(e)=>{
        if(!drawing) return;

        const x=e.nativeEvent.offsetX;
        const y=e.nativeEvent.offsetY;

        setCurrentPath((prev)=>[...prev,{x,y}]);
    };

    const stopDrawing = () => {
        if (!drawing) return;

        addAction({
            type: "pencil",
            points: currentPath,
            color,
            width: brushSize
        });

        setCurrentPath([]);
        setDrawing(false);
  };
  return {startDrawing,draw,stopDrawing,currentPath};
}