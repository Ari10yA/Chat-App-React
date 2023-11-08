import React from "react";
import { useState } from "react";
import Homepage from "./Components/homepage/homepage"
import ChatWindow from "./Components/LayoutChat/chatwindow"
import { Route, Routes, Navigate } from "react-router-dom";


import './App.css';



function App() {
  const [userName, setUserName] = useState('')

  const userNameChangeHandler = ( name ) => {
    setUserName(name);
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage changeHandler={userNameChangeHandler}></Homepage>}></Route>
        {
          userName?<Route path="/main" element={<ChatWindow userName={userName}></ChatWindow>}></Route>: ''
        }
        <Route path="*" element={<Navigate to="/"></Navigate>}></Route>
      </Routes>
      
    </div>
  );
}

export default App;
