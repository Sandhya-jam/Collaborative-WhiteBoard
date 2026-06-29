import {motion} from "framer-motion"

const AuthCard = ({children}) => {
  return (
    <motion.div
    initial={{opacity:0,scale:.9}}
    animate={{opacity:1,scale:1}}
    transition={{duration:.5}}
    className="w-full max-w-md bg-surface/90 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-glow"
    >
        {children}
    </motion.div>
  )
}

export default AuthCard