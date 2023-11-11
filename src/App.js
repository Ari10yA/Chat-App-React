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
  const [selectedUser, setSelectedUser] = useState('')

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
      let newUsers = users.map((user, index) => {
        return {
          ...user,
          self: user.userID === socket.id
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

  const eventHandler = ( message ) => {
    socket.emit('some-event', message);
  }

  const selectedUserHandler = (id) => {
    setSelectedUser(id);
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage changeHandler={userNameChangeHandler}></Homepage>}></Route>
        {
          userName?<Route path="/main" element={<ChatWindow selectedUser={selectedUser} selectedUserHandler={selectedUserHandler} users={users} eventHandler={eventHandler}></ChatWindow>}></Route>: ''
        }
        <Route path="*" element={<Navigate to="/"></Navigate>}></Route>
      </Routes>
      
    </div>
  );
}

export default App;
