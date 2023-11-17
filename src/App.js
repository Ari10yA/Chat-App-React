import React from "react";
import { useState, useEffect } from "react";
import socket from "./socket.js"
import Homepage from "./Components/homepage/homepage"
import ChatWindow from "./Components/LayoutChat/chatwindow"
import { Route, Routes, Navigate } from "react-router-dom";
import Backdrop from "./Components/Backdrop/Backdrop.jsx";
import Modal from "./Components/Modal/modal.jsx";

import './App.css';



function App() {
  const [userName, setUserName] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [someEvents, setSomeEvents] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [displayBackdrop, setDisplayBackdrop] = useState(false);

  useEffect(() => {
    if(userName.length !== 0) {
      const sessionID = localStorage.getItem('sessionID');
      socket.auth = {
        username: userName,
      }
      if(sessionID){
        socket.auth = {
          ...socket.auth,
          sessionID: sessionID
        }
      }
      socket.connect();
    }

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onGetSession({ sessionID, userID }) {
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      socket.userID = userID;
    }
    
    
    socket.on('connect', onConnect);
    socket.on("connect_error", (err) => {
      console.log(err);
    });
    socket.on("session", onGetSession);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect-error');
      socket.off("session", onGetSession);
      socket.off('disconnect', onDisconnect);
    };
  }, [userName]);

  useEffect(() => {
    function onSomeEvent(msg, id, idr) {
      const newMessage = {
        message: msg,
        userID: id, 
        toID: idr
      }
      setSomeEvents(newMessage);
    }
  
    socket.on('some-event', onSomeEvent);
  
    return () => {
      socket.off('some-event', onSomeEvent);
    };
  }, [someEvents]);

  useEffect(() => {
    const onGetUsers = (users) => {
      let newUsers = users.map((user, index) => {
        return {
          ...user,
          self: user.userID === socket.userID
        }
      })

      newUsers.sort((a, b) => {
        if(a.self) return -1;
        if(b.self) return 1;

        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      })
      setUsers([...newUsers]);
    }

    socket.on('users', onGetUsers);

    return () => {
      socket.off('users', onGetUsers);
    }
  }, [users])


  const userNameChangeHandler = ( name ) => {
    setUserName(name);
  }

  const eventHandler = ( message, b, selectedUser ) => {
    socket.emit('some-event', message, socket.userID, selectedUser);
  }

  const selectedUserHandler = (id) => {
    setSelectedUser(id);
  }

  const displayBackdropHandler = () => {
    setDisplayBackdrop((previous) => {
      return !previous;
    })
  }

  return (
    <div className="App">
      <button onClick={() => {displayBackdropHandler()}}>Test</button>
      <Backdrop displayHandler={displayBackdropHandler} classDetails={displayBackdrop}>
        <Modal></Modal>
      </Backdrop>
      <Routes>
        <Route path="/" element={<Homepage changeHandler={userNameChangeHandler}></Homepage>}></Route>
        {
          userName?<Route path="/main" element={<ChatWindow newMessage={someEvents} selectedUser={selectedUser} selectedUserHandler={selectedUserHandler} users={users} eventHandler={eventHandler}></ChatWindow>}></Route>: ''
        }
        <Route path="*" element={<Navigate to="/"></Navigate>}></Route>
      </Routes>
      
    </div>
  );
}

export default App;
