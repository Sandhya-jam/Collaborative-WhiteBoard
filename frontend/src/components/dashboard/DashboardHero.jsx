import { FiPlus } from "react-icons/fi";
import {motion} from "framer-motion"
import { getUser } from "../../utils/auth";
import BoardCard from "./BoardCard";
export const DashboardHero = ({onCreate, boards, isLoading}) => {
    const user=getUser();

  return (
    <motion.section
    initial={{opacity:0,y:30}}
    animate={{opacity:1,y:0}}
    transition={{duration:.5}}
    className="max-w-6xl mx-auto px-6 py-16 flex justify-between items-center flex-wrap gap-10">
    <div className="max-w-3xl">
        <h1 className="text-5xl font-bold">
            Welcome back,
            <span className="text-primary">
                {" "}{user?.name} 👋
            </span>
        </h1>
        <p className="text-muted mt-5 text-lg">
            Your ideas deserve a beautiful workspace.
        </p>
    </div>
    <button 
    onClick={onCreate}
    className="flex items-center gap-3 bg-primary hover:bg-purple-700 transition px-5 py-3 rounded-xl font-semibold">
        <FiPlus size={22}/>New Board
    </button>
    </motion.section>
  )
}
