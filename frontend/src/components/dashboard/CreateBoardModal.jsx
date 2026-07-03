import { useState } from "react"
import {motion} from "framer-motion"
import Input from "../common/Input"
import Button from "../common/Button"
import { useCreateBoardMutation } from "../../features/board/boardApi"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function CreateBoardModal({open,onClose}){
    const [title,setTitle]=useState("");
    const [createBoard,{isLoading}]=useCreateBoardMutation();
    const navigate=useNavigate();

    if(!open) return null;

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(title.trim()===""){
            toast.error("Board title is required");
            return;
        }
        try{
            const board=await createBoard({title}).unwrap();
            toast.success("Board created successfully");
            setTitle("");
            onClose();
            navigate(`/room/${board.roomId}`);
        }catch(err){
            toast.error(err?.data?.message || "Failed to create board");
        }
    };
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <motion.div
            initial={{opacity:0,scale:0.8}}
            animate={{opacity:1,scale:1}}
            transition={{duration:0.3}}
            className="bg-surface border border-border rounded-2xl p-8 w-full max-w-[420px]">
                <h2 className="text-2xl font-bold mb-6">Create New Board</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label="Board Name" value={title} onChange={(e)=>setTitle(e.target.value)} required placeholder="Enter board name"/>
                    <div className="flex gap-4">
                        <Button 
                        type="submit"
                        onClick={onClose}
                        className="bg-gray-700">
                            Cancel
                        </Button>
                        <Button
                        type="submit"
                        disabled={isLoading}>
                            {isLoading ? "Creating...":"Create"}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}