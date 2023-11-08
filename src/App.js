import Homepage from "./Components/homepage/homepage"
import ChatWindow from "./Components/LayoutChat/chatwindow"
import { Route, Routes } from "react-router-dom";

import './App.css';



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ChatWindow></ChatWindow>}></Route>

        {/* <Route path="/main" element={}></Route> */}
      </Routes>
      
    </div>
  );
}

export default App;
