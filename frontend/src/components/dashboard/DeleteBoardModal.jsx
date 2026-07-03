import {motion} from "framer-motion"
import Button from "../common/Button"
import toast from "react-hot-toast"
import {useDeleteBoardMutation} from "../../features/board/boardApi"

export default function DeleteBoardModal({open,board,onClose}){
    const [deleteBoard,{isLoading}] = useDeleteBoardMutation()
    if(!open) return null;
    const handleDelete = async()=>{
        try{
            await deleteBoard(board._id).unwrap()
            toast.success("Board deleted successfully")
            onClose()
        }catch(err){
            toast.error(err?.data?.message || "Failed to delete board")
        }
    }
    return(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <motion.div
            initial={{opacity:0,scale:0.8}}
            animate={{opacity:1,scale:1}}
            className="bg-surface border border-border rounded-2xl p-8 w-[420px]"
            >
                <h2 className="text-2xl font-bold">Delete Board</h2>
                <p className="mt-4 text-muted">
                    Are you sure you want to delete the board 
                    <span className="text-white font-semibold">
                        {" "}{board?.title}
                    </span>? This action cannot be undone.
                </p>
                <div className="flex gap-4 mt-8">
                    <Button 
                    type="button"
                    onClick={onClose}
                    className="bg-gray-700">
                        Cancel
                    </Button>
                    <Button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700">
                        {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}