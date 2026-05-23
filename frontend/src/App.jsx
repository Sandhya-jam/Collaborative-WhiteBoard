import { useState } from "react"
import CanvaBoard from "./components/CanvaBoard"
import { BrowserRouter,Routes,Route } from "react-router-dom";

import JoinRoom from "./pages/JoinRoom";
import RoomPage from "./pages/RoomPage";
const App = () => {
  const [darkMode,setDarkMode]=useState(false);
  return (
    <BrowserRouter>
      <div className={darkMode ? "dark":""}>
        <div className="w-screen h-screen bg-gray-100 dark:bg-gray-900 transition-all duration-300">
          <Routes>
             <Route
             path="/"
             element={
              <JoinRoom
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              />
             }/>

             <Route
             path="/room/:roomId"
             element={
              <RoomPage
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              />
             }
             />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App;