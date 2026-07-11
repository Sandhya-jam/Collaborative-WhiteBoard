import { FiUsers,FiMic,FiSmile} from "react-icons/fi";
import FeatureCard from "./FeatureCard";

const Features = () => {
  return (
    <section 
    id="features" className="max-w-7xl mx-auto px-6 py-28">
    <h2 className="text-5xl font-bold text-center mb-5 text-white">
        Why WhiteFlow?
    </h2>
    <p className="text-center text-muted mb-16">
        Everything you need to brainstrom, collaborate and organize ideas
    </p>
    <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
        icon={<FiUsers/>}
        title="Realtime Collaboration"
        description="Collaborate with teammates instantly using WebSockets with synchronized drawing and editing."
        />
        <FeatureCard
          icon={<FiMic />}
          title="Real-time Voice Chat"
          description="Communicate seamlessly with collaborators using built-in low-latency voice chat while working together"
      />
      <FeatureCard
          icon={<FiSmile />}
          title="Live Emoji Reactions"
          description="Express ideas instantly with real-time floating emoji reactions for engaging collaboration."
      />
    </div>
    </section>
  )
}

export default Features