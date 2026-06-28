import {motion} from "framer-motion"

const Preview = () => {
  return (
    <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
            <motion.div
            initial={{opacity:0,y:40}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true}}
            transition={{duration:0.8}}
            className="rounded-3xl border border-border bg-surface overflow-hidden shadow-glow"
            >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-red-500"/>
                <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                <div className="w-3 h-3 rounded-full bg-green-500"/>
            </div>
            <div className="text-center mb-12">
                <span className="px-4 py-2 rounded-full bg-primary text-primary">
                    Product Review
                </span>
                <h2 className="text-5xl font-bold mt-6">
                    Beautiful Collaboration
                </h2>
                <p className="text-muted mt-4">
                    A modern collaborative whiteboard built for teams.
                </p>
            </div>
            {/* SS */}
            {/* <img
                src={preview}
                alt="Whiteboard Preview"
                className="w-full object-cover"
            /> */}
            <div className="h-[600px] flex items-center justify-center text-muted text-xl">
                WhiteBoard Preview Coming Soon
            </div>
            </motion.div>
        </div>
    </section>
  )
}

export default Preview