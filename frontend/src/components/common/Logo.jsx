import {FiPenTool} from "react-icons/fi"

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-secondary shadow-glow">
            <FiPenTool className='text-xl'/>
        </div>
        <div>
            <h1 className="text-2xl font-bold">White Flow</h1>
        </div>
    </div>
  );
}

export default Logo