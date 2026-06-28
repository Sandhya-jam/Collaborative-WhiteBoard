import {motion} from "framer-motion"
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
        initial={{opacity:0,y:40}}
        animate={{opacity:1,y:0}}
        transition={{duration:1}}
        className="max-4-wl text-center"
        >
        <p className="text-primary font-semibold mb-4 tracking-widset uppercase">
            Collaborative Whiteboard
        </p>
        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
            Design 
            <br/>
            <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Collaborate
            </span>
            <br/>
            Build
        </h1>
        <p className="mt-8 text-muted text-lg max-w-2xl mx-auto leading-8">
            Create beautiful diagrams in real time, collaborate with your team,
            beautify them using AI, and keep every version safely stored
        </p>
        <div className="mt-10 flex justify-center gap-5">
            <Link to='/signup'
            className="px-8 py-4 rounded-xl bg-primary hover:scale-105 transition-all duration-300 font-semibold">
            Get Started
            </Link>
            <a href="#features" 
            className="px-8 py-4 rounded-xl border border-border hover:bg-surface hover:text-white transition-all duration-300">
                Learn More
            </a>
        </div>
        </motion.div>
    </section>
  );
}

export default Hero