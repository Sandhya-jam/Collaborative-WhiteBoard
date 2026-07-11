import {FiMic,FiMicOff,FiX} from "react-icons/fi"
import { getUser } from "../../utils/auth";
const VoicePanel = ({users,micStates,onClose}) => {
  return (
    <div className="absolute top-20 right-5 w-72 bg-surface border border-border rounded-2xl shadow-xl z-40 text-white">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold flex items-center gap-2">
               🎙 Voice Chat 
            </h3>
            <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-700 transition">
                <FiX/>
            </button>
        </div>
        <div className="max-h-72 overflow-y-auto">
            {users?.map((user)=>(
                <div 
                key={user.userId}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-600 transition hover:rounded-full">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center font-semibold">
                            {user?.name[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="font-medium">
                                {user?.name}{user.userId===getUser()._id && "(You)"}
                            </p>
                            <p className="text-xs text-muted">
                                Online
                            </p>
                        </div>
                    </div>
                    {user?.userId && micStates[user?.userId]
                      ? <FiMic className="text-green-400" size={20}/>
                      : <FiMicOff className="text-gray-400" size={20}/>
                    }
                </div>
            ))}
        </div>
    </div>
  );
};

export default VoicePanel;