import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil,faSlash,faSquare,faCircle} from '@fortawesome/free-solid-svg-icons'

const Toolbar = ({color,setColor,brushSize,setBrushSize,clearCanvas,tool,setTool}) => {
    
  return (
    <div className="flex gap-4 p-3 bg-gray-100 border-b items-center">
         <button className="px-3 py-1 bg-white border" onClick={()=>setTool("pencil")}
            title='Pencil'>
                <FontAwesomeIcon icon={faPencil} />
          </button>
        <button className="px-3 py-1 bg-white border" onClick={()=>setTool("line")}>
        Line
        </button>
        <button className="px-3 py-1 bg-white border" onClick={()=>setTool("rectangle")}>
        Rectangle
        </button>
        <button className="px-3 py-1 bg-white border" onClick={()=>setTool("circle")}>
        Circle
        </button>

        <div>
            <label className="mr-2">Color</label>
            <input
            type='color'
            value={color}
            onChange={(e)=>setColor(e.target.value)}
            />
        </div>
        <div>
            <label className="mr-2">Brush Size</label>
            <input
            type='range'
            min="1"
            max="10"
            value={brushSize}
            onChange={(e)=>setBrushSize(e.target.value)}
            />
        </div>
        <button
        onClick={clearCanvas}
        className='bg-red-500 text-white px-4 py-1 rounded'>
          Clear Board
        </button>
    </div>
  )
}

export default Toolbar