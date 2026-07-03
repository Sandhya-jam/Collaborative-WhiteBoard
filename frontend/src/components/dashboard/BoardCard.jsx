import { FiClock,FiMoreVertical } from "react-icons/fi";
import {motion} from "framer-motion"
import {useState,useRef,useEffect} from "react"
import {useNavigate} from "react-router-dom"
import BoardMenu from "./BoardMenu";
const BoardCard = ({board,onRename,onDelete}) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(()=>{
    function handleClick(e){
        if(menuRef.current && !menuRef.current.contains(e.target)){
            setMenuOpen(false);
        }
    }
    document.addEventListener("mousedown", handleClick);
    return () => {
        document.removeEventListener("mousedown", handleClick);
    };
  }, []);
  return (
    <motion.div
    whileHover={{y:-8,scale:1.02}}
    transition={{duration:.3}}
    onClick={()=>navigate(`/room/${board.roomId}`)}
    className="relative bg-surface border border-border rounded-2xl p-6 hover:border-primary hover:shadow-glow transition-all cursor-pointer">
        <div className="flex justify-between items-start gap-4">
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white truncate">
                    {board?.title}
                </h2>
            </div>
            <div className="relative" ref={menuRef}>
                <button 
                onClick={(e)=>{
                    e.stopPropagation();
                    setMenuOpen(!menuOpen);
                }}
                className="text-muted hover:text-white transition">
                    <FiMoreVertical size={22}/>
                </button>
                <BoardMenu
                open={menuOpen}
                onRename={()=>{
                    setMenuOpen(false);
                    onRename(board);
                }}
                onDelete={()=>{
                    setMenuOpen(false);
                    onDelete(board);
                }}/>
            </div>
        </div>
        <div className="mt-10 flex items-center gap-2 text-muted">
            <FiClock/>
            <span className="text-sm text-muted">
                Updated recently
            </span>
        </div>
    </motion.div>
  )
}

export default BoardCard