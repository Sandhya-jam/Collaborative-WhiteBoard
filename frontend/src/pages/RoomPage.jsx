import { useParams } from "react-router-dom";
import CanvasBoard from '../components/CanvaBoard';

const RoomPage = ({darkMode,setDarkMode}) => {
    const {roomId}=useParams()
  return (
    <CanvasBoard 
    roomId={roomId}
    darkMode={darkMode}
    setDarkMode={setDarkMode}
    />
  )
}

export default RoomPage