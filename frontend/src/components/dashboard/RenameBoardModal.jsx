import { useState,useEffect } from "react"
import {motion} from "framer-motion"
import Input from "../common/Input"
import Button from "../common/Button"
import { useRenameBoardMutation } from "../../features/board/boardApi"
import toast from "react-hot-toast"

export default function RenameBoardModal({open,onClose,board}){
    const [title,setTitle]=useState("");
    const [renameBoard,{isLoading}]=useRenameBoardMutation();

    useEffect(()=>{
        if(board) setTitle(board.title);
    },[board]);

    if(!open) return null;

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(title.trim()===""){
            toast.error("Board title is required");
            return;
        }
        try{
            await renameBoard({id:board._id,title}).unwrap();
            toast.success("Board renamed successfully");
            onClose();
        }catch(err){
            toast.error(err?.data?.message || "Failed to rename board");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
            <motion.div
            initial={{opacity:0,scale:0.8}}
            animate={{opacity:1,scale:1}}
            transition={{duration:0.3}}
            className="bg-surface border border-border rounded-2xl p-8 w-full max-w-[420px]">
                <h2 className="text-2xl font-bold mb-6">Rename Board</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label="Board Name" value={title} onChange={(e)=>setTitle(e.target.value)} required placeholder="Enter board name"/>
                    <div className="flex gap-4">
                        <Button 
                        type="button"
                        onClick={onClose}
                        className="bg-gray-700">
                            Cancel
                        </Button>
                        <Button
                        type="submit"
                        disabled={isLoading}>
                            {isLoading ? "Renaming...":"Rename"}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}