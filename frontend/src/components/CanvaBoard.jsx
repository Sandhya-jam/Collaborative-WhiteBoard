import {useRef,useEffect,useState} from 'react'
import Toolbar from './Toolbar'

const CanvaBoard = () => {
    const canvasRef=useRef(null)
    const [drawing,setDrawing]=useState(false)
    const [color,setColor]=useState("#000000")
    const [brushSize,setBrushSize]=useState(3)
    const [tool,setTool]=useState("pencil")
    const [startX,setStartX]=useState(0)
    const [startY,setStartY]=useState(0)

    useEffect(()=>{
        const canvas=canvasRef.current;
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight-50;

        const ctx=canvas.getContext("2d");
        ctx.lineWidth=3;
        ctx.lineCap="round";
    },[]);

    const startDrawing=(e)=>{
        const x=e.nativeEvent.offsetX;
        const y=e.nativeEvent.offsetY;

        setStartX(x)
        setStartY(y)

        const ctx=canvasRef.current.getContext("2d")
        
        ctx.strokeStyle=color;
        ctx.lineWidth=brushSize;

        if(tool==="pencil"){
            ctx.beginPath();
            ctx.moveTo(x,y)
        }
        //ctx.lineCap="round";

        setDrawing(true)
    };

    const draw=(e)=>{
        if(!drawing) return;

        const ctx=canvasRef.current.getContext("2d");
        const x=e.nativeEvent.offsetX
        const y=e.nativeEvent.offsetY

        ctx.strokeStyle=color
        ctx.lineWidth=brushSize

        if(tool==="pencil"){
            ctx.lineTo(x,y)
            ctx.stroke();
        }
    };

    const stopDrawing=(e)=>{
        const ctx=canvasRef.current.getContext("2d")

        const x=e.nativeEvent.offsetX
        const y=e.nativeEvent.offsetY

        if(tool==="line"){
            ctx.beginPath();
            ctx.moveTo(startX,startY);
            ctx.lineTo(x,y);
            ctx.stroke();
        }
        if(tool==="rectangle"){
            const width=x-startX
            const height=y-startY

            ctx.strokeRect(startX,startY,width,height);
        }
        if(tool==="circle"){
            const radius=Math.sqrt(Math.pow(x-startX,2)+Math.pow(y-startY,2));
            ctx.beginPath();
            ctx.arc(startX,startY,radius,0,2*Math.PI);
            ctx.stroke();
        }
        setDrawing(false);
    };

    const clearCanvas=()=>{
        const canvas=canvasRef.current;
        const ctx=canvas.getContext("2d");

        ctx.clearRect(0,0,canvas.width,canvas.height)
    }
  return (
    <div>
        <Toolbar
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        clearCanvas={clearCanvas}
        tool={setTool}
        setTool={setTool}
        />
        <canvas
        ref={canvasRef}
        className='border border-gray-400'
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        />
    </div>
  );
}

export default CanvaBoard