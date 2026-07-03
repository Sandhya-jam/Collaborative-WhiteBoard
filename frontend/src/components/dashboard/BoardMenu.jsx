import { FiEdit2,FiTrash2 } from "react-icons/fi";
import {motion} from "framer-motion"

const BoardMenu = ({open,onRename,onDelete}) => {
    if(!open) return null;
  return (
    <motion.div
    initial={{opacity:0,scale:0.95}}
    animate={{opacity:1,scale:1}}
    className="absolute top-12 right-0 w-44 bg-surface border border-border rounded-xl shadow-glow overflow-hidden z-50">
        <button
        onClick={(e) => {
            e.stopPropagation();
            onRename();
        }}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-background transition">
            <FiEdit2 size={18}/>
            <span className="text-sm text-muted">
                Rename  
            </span>
        </button>
        <button
        onClick={(e) => {
            e.stopPropagation();
            onDelete();
        }}
        className="w-full px-4 py-3 flex items-center gap-3
        text-red-400 hover:bg-background transition">
            <FiTrash2 size={18}/>
            <span className="text-sm text-muted">
                Delete
            </span>
        </button>
    </motion.div>
  );
}

export default BoardMenu