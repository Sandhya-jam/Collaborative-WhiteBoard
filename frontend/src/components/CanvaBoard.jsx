import {useRef,useEffect,useState} from 'react'
import Toolbar from './Toolbar'
import useHistory from '../hooks/useHistory'
import useCanvas from '../hooks/useCanvas'
import { drawAll } from '../utils/drawUtils'
import useSocket from '../hooks/useSocket'
import {getUser} from '../utils/auth' 
import {socket} from "../socket"
import RemoteCursors from './RemoteCursors'
import useCursor from '../hooks/useCursor'
import Users from './Users'
import useToast from '../hooks/useToast'
import Toasts from './Toasts'
import useExport from '../hooks/useExport'
import useInvite from '../hooks/useInvite'
import useProfile from '../hooks/useProfile';
import useTextTool from '../hooks/useTextTool';
import TextInput from './TextInput';
import useSelection from '../hooks/useSelection';
import audioAcess from '../utils/audioAcess'
import DeleteCanvas from './DeleteCanvas'
import VoicePanel from './Voice/VoicePanel'
const CanvaBoard = ({darkMode,setDarkMode,roomId}) => {
    const canvasRef=useRef(null)
    const firstLoad=useRef(null)
    const [color,setColor]=useState("#000000")
    const [brushSize,setBrushSize]=useState(3)
    const [remotePaths,setRemotePaths]=useState({});
    const [users,setUsers]=useState([]);
    const [tool,setTool]=useState("pencil")
    const [remoteCursors,setRemoteCursors]=useState({});
    const [myReaction,setMyReaction]=useState(null)
    const remoteAudioRef=useRef(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [showVoicePanel, setShowVoicePanel] = useState(true);
    const [micStates, setMicStates] = useState({});
    const roomLoaded = useRef(false);
    const loadingRoom = useRef(true);
    const {micOn,setMicOn,initializeAudio,toggleMic,createPeerConnection,peerConnections,createOffer,createAnswer,remoteStream}=audioAcess({socket,setMicStates})
    const {copyInvite}=useInvite(roomId);
    const {exportPNG}=useExport(canvasRef);
    const {toasts,addToast}=useToast();
    const {actions,setActions,addAction,undo,redo,clearCanvas,history,setHistory,addModifyOperation,redoHistory,setRedoHistory}=useHistory();
    const {socketRef,sendAction}=useSocket(addAction,setActions,setRemotePaths,undo,redo,clearCanvas,users,setUsers,setRemoteCursors,addToast,
        setHistory,setRedoHistory,addModifyOperation,createPeerConnection,peerConnections,createOffer,createAnswer,micOn,remoteAudioRef,setMicStates,roomLoaded,loadingRoom);
    const profile=useProfile();
    const {sendCursor}=useCursor(socketRef,getUser()._id,profile);
    const user=getUser();
    const {selectedId, setSelectedId,dragging,setDragging,dragOffset,setDragOffset,resizing,setResizing} = useSelection();
    const{textInput,setTextInput,textPosition,startText,submitText}=useTextTool(user._id,color,addAction,sendAction);
    const {startDrawing,draw,stopDrawing,currentPath,preview}=useCanvas(addAction,color,brushSize,tool,socketRef,sendAction,startText,actions,
        setActions,selectedId,setSelectedId,dragging,setDragging,dragOffset,setDragOffset,resizing,setResizing,addModifyOperation,user._id);
    

    const handleUndo=()=>{
        if(!socketRef.current) return;

        console.log("UNDO BUTTON CLICKED");
        const userId=user._id
        undo(userId);
        console.log("EMITTING UNDO");
        socketRef.current.emit("undo",{userId});
    };

    const handleRedo = () => {
        if (!socketRef?.current) return;
        console.log("REDO BUTTON CLICKED");
        const userId=user._id
        redo(userId);

        socketRef.current.emit("redo", { userId });
    };
    
    const handleClear=()=>{
        if (!socketRef?.current) return;
        const userId = user._id;
        clearCanvas(userId);
        socketRef.current.emit("clear-canvas", { userId });
        setOpenDeleteModal(false);
    };

    const sendReaction=(emoji)=>{
        setMyReaction(emoji);
        const userId=user._id
        socketRef.current.emit("emoji-reaction", {
            userId,
            emoji,
            name:profile.name
        });
        setTimeout(() => {
            setMyReaction(null);
        }, 2000);
    }

    useEffect(()=>{
        const canvas=canvasRef.current;
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight-50;
        console.log(window.innerWidth,window.innerHeight);
        const ctx=canvas.getContext("2d");
        ctx.lineWidth=3;
        ctx.lineCap="round";
        if(tool!=="select") setSelectedId(null);
        const handleKey = (e) => {
        if(e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
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
            handleClear();
            break;
        default:
            break;
        }
    };
    console.log("CANVASBOARD ACTIONS", actions);
    drawAll(ctx,actions,currentPath,preview,color,brushSize,remotePaths,selectedId);
    window.addEventListener("keydown",handleKey);
    return ()=>window.removeEventListener("keydown",handleKey);
    },[darkMode,actions,currentPath,preview,remotePaths,tool,selectedId]);
    
    useEffect(() => {
        const AudioPer=async()=>{
            if(roomId && socketRef.current){
                console.log("JOINING ROOM:",roomId);
                const userId=user?._id;
                const userName=user?.name;
                const userEmail=user?.email;
                await initializeAudio();
                socketRef.current.emit("join-room", {roomId,userId,name:userName,mail:userEmail,micOn:micOn});
            }
        }
        AudioPer();
    }, [roomId]);

    useEffect(()=>{
        if (!roomLoaded.current || loadingRoom.current) return;

        const timer = setTimeout(() => {
            socketRef.current?.emit("persist-object", {
                actions,
                history,
                redoHistory,
            });
        }, 300);

        return () => clearTimeout(timer);
    },[actions,history,redoHistory])
    
    useEffect(()=>{
        const handleDelete=(e)=>{
            if(e.key!=="Backspace" && e.key!=="Delete") return;
            if(!selectedId) return;
            setActions(prev=>prev.filter(a=>a.id!==selectedId));
            setSelectedId(null);
        };
        window.addEventListener("keydown",handleDelete);
        return ()=>window.removeEventListener("keydown",handleDelete);
    },[selectedId]);
    
    useEffect(()=>{
        if(!remoteStream || !remoteAudioRef.current) return;
        console.log("Remote Stream Changed:", remoteStream);
        remoteAudioRef.current.srcObject=remoteStream;
        remoteAudioRef.current
    .play()
    .then(() => {
        console.log("Audio Playing ✅");
    })
    .catch(err => {
        console.error("Play Error", err);
    });
    },[remoteStream,remoteAudioRef]);
  return (
    <div>
        <Users users={users}/>
        <Toolbar color={color} setColor={setColor} brushSize={brushSize}
        setBrushSize={setBrushSize} setOpenDeleteModal={setOpenDeleteModal} tool={tool}
        setTool={setTool} darkMode={darkMode} setDarkMode={setDarkMode}
        undo={handleUndo} redo={handleRedo} exportPNG={exportPNG}
        copyInvite={copyInvite} addToast={addToast} sendReaction={sendReaction}
        micOn={micOn} setMicOn={setMicOn} toggleMic={toggleMic}
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
        <DeleteCanvas open={openDeleteModal} onCancel={() => setOpenDeleteModal(false)} onConfirm={handleClear}/>
        <RemoteCursors remoteCursors={remoteCursors} />
        <Toasts toasts={toasts} />
        <TextInput
        position={textPosition}
        value={textInput}
        setValue={setTextInput}
        onSubmit={submitText}/>
        {myReaction && (
            <div className="fixed left-24 top-[58%] text-5xl emojiFloat z-[999] pointer-events-none">
                {myReaction}
            </div>
        )}
        <audio
        ref={remoteAudioRef}
        autoPlay
        playsInline
        hidden
        />
        {showVoicePanel && (
        <VoicePanel
        users={users}
        micStates={micStates}
        onClose={() => setShowVoicePanel(false)}/>)}
        {!showVoicePanel && (
        <button
        onClick={() => setShowVoicePanel(true)}
        className="absolute top-20 right-5 bg-surface border border-border rounded-full px-4 py-2 shadow-lg text-white">
        🎙 Voice</button>
        )}
    </div>
  );
}

export default CanvaBoard;