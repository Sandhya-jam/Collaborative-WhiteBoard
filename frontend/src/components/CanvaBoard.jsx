import {useRef,useEffect,useState} from 'react'
import Toolbar from './Toolbar'
import useHistory from '../hooks/useHistory'
import useCanvas from '../hooks/useCanvas'
import { drawAll } from '../utils/drawUtils'

const CanvaBoard = ({darkMode,setDarkMode}) => {
    const canvasRef=useRef(null)
    const {actions,addAction,undo,redo,clearCanvas}=useHistory();
    const [color,setColor]=useState("#000000")
    const [brushSize,setBrushSize]=useState(3)

    const [tool,setTool]=useState("pencil")
    const {startDrawing,draw,stopDrawing,currentPath,preview}=useCanvas(addAction,color,brushSize,tool);

    useEffect(()=>{
        const canvas=canvasRef.current;
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight-50;

        const ctx=canvas.getContext("2d");
        ctx.lineWidth=3;
        ctx.lineCap="round";

        //clears canvas whenever the theme changed
        // ctx.fillStyle = darkMode ? "#1f2937" : "#ffffff"; // dark gray / white
        // ctx.fillRect(0, 0, canvas.width, canvas.height);

        const handleKey = (e) => {
        switch (e.key.toLowerCase()) {
        case "p":
            setTool("pencil");
            break;
        case "l":
            setTool("line");
            break;
        case "r":
            setTool("rectangle");
            break;
        case "c":
            setTool("circle");
            break;
        case "e":
            clearCanvas();
            break;
        default:
            break;
        }
    };
    drawAll(ctx,actions,currentPath,preview,color,brushSize);
    window.addEventListener("keydown",handleKey);
    return ()=>window.removeEventListener("keydown",handleKey);
    },[darkMode,actions,currentPath,preview]);

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
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        undo={undo}
        redo={redo}
        />
        <canvas
        ref={canvasRef}
        className='bg-white w-screen h-screen cursor-crosshair dark:bg-gray-800'
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        // onMouseLeave={stopDrawing}
        />
    </div>
  );
}

export default CanvaBoard