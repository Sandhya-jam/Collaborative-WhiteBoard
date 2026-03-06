import {useRef,useEffect,useState} from 'react'

const CanvaBoard = () => {
    const canvasRef=useRef(null)
    const [drawing,setDrawing]=useState(false)

    useEffect(()=>{
        const canvas=canvasRef.current;
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;

        const ctx=canvas.getContext("2d");
        ctx.lineWidth=3;
        ctx.lineCap="round";
    },[]);

    const startDrawing=(e)=>{
        const ctx=canvasRef.current.getContext("2d")
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX,e.nativeEvent.offsetY);
        setDrawing(true)
    };

    const draw=(e)=>{
        if(!drawing) return

        const ctx=canvasRef.current.getContext("2d");
        ctx.lineTo(e.nativeEvent.offsetX,e.nativeEvent.offsetY);
        ctx.stroke();
    }

    const stopDrawing=()=>{
        setDrawing(false);
    }
  return (
    <canvas
    ref={canvasRef}
    className='border border-gray-400'
    onMouseDown={startDrawing}
    onMouseMove={draw}
    onMouseUp={stopDrawing}
    onMouseLeave={stopDrawing}
    />
  );
}

export default CanvaBoard