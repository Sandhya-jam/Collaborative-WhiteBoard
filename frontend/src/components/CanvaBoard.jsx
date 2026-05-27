import {useRef,useEffect,useState} from 'react'
import Toolbar from './Toolbar'
import useHistory from '../hooks/useHistory'
import useCanvas from '../hooks/useCanvas'
import { drawAll } from '../utils/drawUtils'
import useSocket from '../hooks/useSocket'
import { getUserId } from '../utils/userId'
import RemoteCursors from './RemoteCursors'
import useCursor from '../hooks/useCursor'
import Users from './Users'
import useToast from '../hooks/useToast'
import Toasts from './Toasts'
import useExport from '../hooks/useExport'
const CanvaBoard = ({darkMode,setDarkMode,roomId}) => {
    const canvasRef=useRef(null)
    const [color,setColor]=useState("#000000")
    const [brushSize,setBrushSize]=useState(3)
    const [remotePaths,setRemotePaths]=useState({});
    const [users,setUsers]=useState([]);
    const [tool,setTool]=useState("pencil")
    const [remoteCursors,setRemoteCursors]=useState({});
    
    const {exportPNG}=useExport(canvasRef);
    const {toasts,addToast}=useToast();
    const {actions,setActions,addAction,undo,redo,clearCanvas}=useHistory();
    const {socketRef,sendAction}=useSocket(addAction,setActions,setRemotePaths,undo,redo,clearCanvas,setUsers,setRemoteCursors,addToast);
    const {startDrawing,draw,stopDrawing,currentPath,preview}=useCanvas(addAction,color,brushSize,tool,socketRef,sendAction);
    const {sendCursor}=useCursor(socketRef,getUserId());
    const userId=getUserId();

    const handleUndo=()=>{
        if(!socketRef.current) return;

        console.log("UNDO BUTTON CLICKED");
        undo(userId);
        console.log("EMITTING UNDO");
        socketRef.current.emit("undo",{userId});
    };

    const handleRedo = () => {
        if (!socketRef?.current) return;
        console.log("REDO BUTTON CLICKED");
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
    
    useEffect(() => {
        if(roomId && socketRef.current){
            console.log("JOINING ROOM:",roomId);
            socketRef.current.emit("join-room", { roomId, userId });
        }

    }, [roomId]);
    
  return (
    <div>
        <Users users={users}/>
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
        exportPNG={exportPNG}
        />
        <canvas
        ref={canvasRef}
        className='bg-white w-screen h-screen cursor-crosshair dark:bg-gray-800'
        onMouseDown={startDrawing}
        onMouseMove={(e)=>{
            draw(e);
            sendCursor(e);
        }}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        />
        <RemoteCursors remoteCursors={remoteCursors} />
        <Toasts toasts={toasts} />
    </div>
  );
}

export default CanvaBoard