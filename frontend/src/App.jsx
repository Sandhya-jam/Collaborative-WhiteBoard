import { useState } from "react"
import CanvaBoard from "./components/CanvaBoard"

const App = () => {
  const [darkMode,setDarkMode]=useState(false);
  return (
    <div className={darkMode?"dark":""}>
      <div className="w-screen h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">
      <CanvaBoard darkMode={darkMode} setDarkMode={setDarkMode}/>
    </div>
    </div>
  )
}

export default App