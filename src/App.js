import React from "react";
import { useState, useEffect } from "react";
import socket from "./socket.js"
import Homepage from "./Components/homepage/homepage"
import ChatWindow from "./Components/LayoutChat/chatwindow"
import { Route, Routes, Navigate } from "react-router-dom";
import Backdrop from "./Components/Backdrop/Backdrop.jsx";
import Modal from "./Components/Modal/modal.jsx";
import { useNavigate } from 'react-router-dom';

import './App.css';



function App() {
  const [userName, setUserName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [someEvents, setSomeEvents] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [displayBackdrop, setDisplayBackdrop] = useState(false);

  const navigate = useNavigate();

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
      
    }

    function onDisconnect() {
      navigate('/');
      setSomeEvents(null);
      setUsers([]);
      setSelectedUser('')
    }

    function onDisconnection() {
      setIsConnected(false);
      setUserName('');
      localStorage.clear();
      socket.disconnect();
    }

    function onGetSession({ sessionID, userID }) {
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      socket.userID = userID;
      setIsConnected(true);
    }
    
    
    socket.on('connect', onConnect);
    socket.on("connect_error", (err) => {
      console.log(err);
    });
    socket.on("session", onGetSession);
    socket.on('disconnect', onDisconnect);
    socket.on('disconnection-handler', onDisconnection);

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect-error');
      socket.off("session", onGetSession);
      socket.off('disconnect', onDisconnect);
      socket.off('disconnection-handler', onDisconnection);
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
      <Backdrop displayHandler={displayBackdropHandler} classDetails={displayBackdrop}>
        <Modal></Modal>
      </Backdrop>
      <Routes>
        <Route path="/" element={<Homepage changeHandler={userNameChangeHandler}></Homepage>}></Route>
        {
          userName?<Route path="/main" element={<ChatWindow backDropHandler={displayBackdropHandler} newMessage={someEvents} selectedUser={selectedUser} selectedUserHandler={selectedUserHandler} users={users} eventHandler={eventHandler}></ChatWindow>}></Route>: ''
        }
        <Route path="*" element={<Navigate to="/"></Navigate>}></Route>
      </Routes>
      
    </div>
  );
}

export default App;
