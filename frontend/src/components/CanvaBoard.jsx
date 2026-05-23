import {useRef,useEffect,useState} from 'react'
import Toolbar from './Toolbar'
import useHistory from '../hooks/useHistory'
import useCanvas from '../hooks/useCanvas'
import { drawAll } from '../utils/drawUtils'
import useSocket from '../hooks/useSocket'

const CanvaBoard = ({darkMode,setDarkMode,roomId}) => {
    const canvasRef=useRef(null)
    const [color,setColor]=useState("#000000")
    const [brushSize,setBrushSize]=useState(3)
    const [remotePaths,setRemotePaths]=useState({});

    const [tool,setTool]=useState("pencil")
    const {actions,setActions,addAction,undo,redo,clearCanvas}=useHistory();
    const {socketRef,sendAction}=useSocket(addAction,setActions,setRemotePaths,undo,redo,clearCanvas);
    const {startDrawing,draw,stopDrawing,currentPath,preview}=useCanvas(addAction,color,brushSize,tool,socketRef,sendAction);

    const handleUndo=()=>{
        if(!socketRef.current) return;

        const userId=socketRef.current.id;
        console.log("UNDO BUTTON CLICKED");
        undo(userId);
        console.log("EMITTING UNDO");
        socketRef.current.emit("undo",{userId});
    };

    const handleRedo = () => {
        if (!socketRef?.current) return;

        const userId = socketRef.current.id;
        redo(userId);

        socketRef.current.emit("redo", { userId });
    };
    
    const handleClear=()=>{
        if (!socketRef?.current) return;
        const confirmed =
        window.confirm(
            "Clear your drawings?"
        );
        if (!confirmed) return;
        const userId = socketRef.current.id;
        
        console.log("CLEAR CLICKED", userId);
        clearCanvas(userId);
        console.log("EMITTING CLEAR");
        socketRef.current.emit("clear-canvas",{userId});
    };

    useEffect(()=>{
        const canvas=canvasRef.current;
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight-50;

        const ctx=canvas.getContext("2d");
        ctx.lineWidth=3;
        ctx.lineCap="round";
        
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
    drawAll(ctx,actions,currentPath,preview,color,brushSize,remotePaths);
    window.addEventListener("keydown",handleKey);
    //console.log("ACTIONS:",actions);
    return ()=>window.removeEventListener("keydown",handleKey);
    },[darkMode,actions,currentPath,preview,remotePaths]);
    
    useEffect(()=>{
        if(roomId && socketRef.current){
            socketRef.current.emit("join-room",roomId);
        }
    },[roomId]);

  return (
    <div>
        <Toolbar
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        clearCanvas={handleClear}
        tool={setTool}
        setTool={setTool}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        undo={handleUndo}
        redo={handleRedo}
        />
        <canvas
        ref={canvasRef}
        className='bg-white w-screen h-screen cursor-crosshair dark:bg-gray-800'
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        />
    </div>
  );
}

export default CanvaBoard