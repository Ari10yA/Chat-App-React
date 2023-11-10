import React from "react";
import { useState, useEffect } from "react";
import socket from "./socket.js"
import Homepage from "./Components/homepage/homepage"
import ChatWindow from "./Components/LayoutChat/chatwindow"
import { Route, Routes, Navigate } from "react-router-dom";


import './App.css';



function App() {
  const [userName, setUserName] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [someEvents, setSomeEvents] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if(userName.length !== 0) {
      socket.auth = {
        username: userName
      }
      socket.connect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }
    

    socket.on('connect', onConnect);
    socket.on("connect_error", (err) => {
      console.log(err);
    });
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect-error')
      socket.off('disconnect', onDisconnect);
    };
  }, [userName]);

  useEffect(() => {
    function onSomeEvent(value) {
      setSomeEvents(someEvents.concat(value));
    }
  
    socket.on('some-event', onSomeEvent);
  
    return () => {
      socket.off('some-event', onSomeEvent);
    };
  }, [someEvents]);

  useEffect(() => {
    const onGetUsers = (users) => {
      console.log(users);
    }

    socket.on('users', onGetUsers);

    return () => {
      socket.off('users', onGetUsers);
    }
  }, users)


  const userNameChangeHandler = ( name ) => {
    setUserName(name);
  }

  const eventHandler = ( message ) => {
    socket.emit('some-event', message);
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage changeHandler={userNameChangeHandler}></Homepage>}></Route>
        {
          userName?<Route path="/main" element={<ChatWindow userName={userName} eventHandler={eventHandler}></ChatWindow>}></Route>: ''
        }
        <Route path="*" element={<Navigate to="/"></Navigate>}></Route>
      </Routes>
      
    </div>
  );
}

export default App;
