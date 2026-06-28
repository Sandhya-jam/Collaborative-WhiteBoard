import {motion} from "framer-motion"
import { Link } from "react-router-dom"

const CTA = () => {
  return (
    <section className="py-32 px-6">
        <motion.div
        initial={{opacity:0,y:40}}
        whileInView={{opacity:1,y:0}}
        viewport={{once:true}}
        transition={{duration:0.8}}
        className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-purple-700/30 to-blue-700/20 border border-border p-14 text-center"
        >
        <h2 className="text-5xl font-bold">
            Ready to build together?
        </h2>
        <p className="mt-6 text-muted text-lg">
            Create your first collaborative board in less than a minute
        </p>
        <Link
        to="/signup"
        className="inline-block mt-10 px-8 py-4 rounded-xl bg-primary hover:scale-105 transition"
        >Get Started Free →</Link>
        </motion.div>
    </section>
  )
}

export default CTA