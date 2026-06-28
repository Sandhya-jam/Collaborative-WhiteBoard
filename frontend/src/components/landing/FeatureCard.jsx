import {motion} from "framer-motion"

const FeatureCard = ({icon,title,description}) => {
  return (
    <motion.div
    whileHover={{y:-8,scale:1.03}}
    transition={{duration:0.2}}
    className="bg-surface border border-border rounded-2xl p-6 shadow-lg hover:shadow-glow transition-all"
    >
        <div className="text-primary text-4xl mb-5">
            {icon}
        </div>
        <h3 className="text-2xl font-semibold mb-5 text-white">
            {title}
        </h3>
        <p className="text-muted leading-7">
            {description}
        </p>
    </motion.div>
  )
}

export default FeatureCard