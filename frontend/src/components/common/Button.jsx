import {motion} from "framer-motion"

const Button=({children,type="button",onClick,className="",disabled=false}) => {
  return (
    <motion.button
    whileHover={{scale:disabled?1:1.03}}
    whileTap={{scale:disabled?1:0.98}}
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-3 rounded-xl bg-primary text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow hover:from-purple-600 hover:to-blue-600 bg-gradient-to-r from-secondary to-primary ${className}`}
    >
    {children}
    </motion.button>
  );
}

export default Button