import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil,faSlash,faTimesRectangle,faSquare,faCircle,faTrash,faLocationArrow,faTextHeight} from '@fortawesome/free-solid-svg-icons'
import Tooltip from './tooltip';

const Toolbar = ({color,setColor,brushSize,setBrushSize,
  clearCanvas,tool,setTool,darkMode,setDarkMode,undo,redo,exportPNG,copyInvite,addToast}) => {
    const baseBtn="relative overflow-hidden w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 active:scale-90";
    const active="bg-blue-500 text-white shadow-md scale-105";
    const inactive="bg-white text-gray-700 hover:bg-gray-200 hover:scale-105";

  return (
    <div className="fixed top-4 left-1/4 transform-translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-white shadow-lg rounded-xl border">
      {/* Pencil */}
        <button
          onClick={(e)=>setTool("pencil")}
          title='Pencil'
          className={`${baseBtn} ${tool==="pencil"?active:inactive}`}>
          <FontAwesomeIcon icon={faPencil}/>
        </button>
      {/* Line */}
      <button
      onClick={()=>setTool("line")}
      title='Line'
      className={`${baseBtn} ${tool==="line"?active:inactive}`}>
        <FontAwesomeIcon icon={faSlash}/>
      </button>
      {/* Rectangle */}
      <button
      onClick={()=>setTool("rectangle")}
      title='Rectangle'
      className={`${baseBtn} ${tool==="rectangle"?active:inactive}`}>
        <FontAwesomeIcon icon={faSquare}/>
      </button>
      {/* Circle */}
      <button
      onClick={()=>setTool("circle")}
      title='Circle'
      className={`${baseBtn} ${tool==="circle"?active:inactive}`}>
        <FontAwesomeIcon icon={faCircle}/>
      </button>
      {/* Text */}
      <button
      onClick={()=>setTool("text")}
      title='Text'
      className={`${baseBtn} ${tool==="text"?active:inactive}`}>
        <FontAwesomeIcon icon={faTextHeight}/>
      </button>
      {/* Divider */}
      <div className="w-px h-6 bg-gray-300"></div>
      {/* Color Picker */}
      <input 
        type="color" 
        value={color}
        onChange={(e)=>setColor(e.target.value)}
        className='w-10 h-10 border rounded cursor-pointer'
        title='Pick Color'/>
      {/* Brush Size */}
      <input 
      type="range"
      min="1"
      max="10"
      value={brushSize}
      onChange={(e)=>setBrushSize(e.target.value)}
      className='cursor-pointer'
      title='Brush Size' 
      />
      {/* Clear */}
      <button
        onClick={clearCanvas}
        title='Clear Board'
        className={`${baseBtn} bg-red-500 text-white hover:bg-red-600`}
        >
         <FontAwesomeIcon icon={faTrash}/>
      </button>
      {/* Toggle node */}
      <button
      onClick={()=>setDarkMode((prev)=>!prev)}
      className='w-10 h-10 rounded-lg bg-gary-800 text-white dark:bg-yellow-600 dark:text-black transition-all'
      title='Toggle Theme'>
         {darkMode?"☀️":"🌙"}
      </button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
      <button onClick={()=>setTool("select")}
        className={`${baseBtn} ${tool==="select"?active:inactive}`}>
        <FontAwesomeIcon icon={faLocationArrow}/>
      </button>
      {/* Export PNG */}
      <button onClick={exportPNG}
      className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-all"
      >Export PNG</button>
      {/* Copy Invite */}
      <button
      onClick={async()=>{
        await copyInvite();
        addToast("Invite link copied","join");
      }}
      className="px-3 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition-all">
       Invite
      </button>
    </div>
  ); 
}

export default Toolbar