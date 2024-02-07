import React from "react";
import { useState, useEffect } from "react";
import socket from "./socket.js";
import Homepage from "./Components/homepage/homepage";
import ChatWindow from "./Components/LayoutChat/chatwindow";
import { Route, Routes, Navigate } from "react-router-dom";
import Backdrop from "./Components/Backdrop/Backdrop.jsx";
import Modal from "./Components/Modal/modal.jsx";
import { useNavigate } from "react-router-dom";
import Logout from "./Components/Logout/logout.jsx";
import AddUser from "./Components/AddUserForm/adduser.jsx";

import "./App.css";
import "./index.css";

function App() {
  const [userName, setUserName] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [someEvents, setSomeEvents] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [displayBackdrop, setDisplayBackdrop] = useState(false);

  const navigate = useNavigate();

  const userValidityCheck = (users, id) => {
    const searchedUser = users.find((user) => {
      return user.userID === id;
    });
    if (searchedUser) {
      console.log("found from validity check");
      return true;
    }
    console.log("not found from validity check");
    return false;
  };

  //for texting the connection
  // useEffect(() => {
  //   socket.connect();
  // }, []);

  //For making the connection and handling default behaviour of socket
  useEffect(() => {
    if (userName.length !== 0) {
      const sessionID = localStorage.getItem("sessionID");
      socket.auth = {
        username: userName,
      };
      if (sessionID) {
        socket.auth = {
          ...socket.auth,
          sessionID: sessionID,
        };
      }
      socket.connect();
    }

    function onConnect() {}

    function onDisconnect() {
      navigate("/");
      setSomeEvents(null);
      setUsers([]);
      setSelectedUser("");
    }

    function onDisconnection() {
      setIsConnected(false);
      setUserName("");
      localStorage.clear();
      socket.disconnect();
    }

    function onGetSession({ sessionID, userID, user }) {
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      socket.userID = userID;
      setIsConnected(true);
      let formData = {
        userID: userID,
      };
      fetch("http://localhost:4000/fetchusers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          setUsers(result.data.users);
        })
        .catch((err) => {
          console.log(err, "from fetch");
        });

      setUsers([{ ...user, self: true, name: "" }]);
    }

    socket.on("connect", onConnect);
    socket.on("connect_error", (err) => {
      console.log(err);
    });
    socket.on("session", onGetSession);
    socket.on("disconnect", onDisconnect);
    socket.on("disconnection-handler", onDisconnection);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect-error");
      socket.off("session", onGetSession);
      socket.off("disconnect", onDisconnect);
      socket.off("disconnection-handler", onDisconnection);
    };
  }, [userName, navigate]);

  //used for handling socket 'some-event'
  useEffect(() => {
    function onSomeEvent(msg, id, idr) {
      const newMessage = {
        message: msg,
        userID: id,
        toID: idr,
      };
      //condition to check if the message coming from a known user or not: in this its unknown
      if (!userValidityCheck(users, id)) {
        socket.emit("add-user-req2", id, (response) => {
          if (!userValidityCheck(users, response.user.userID)) {
            let newUser = {
              ...response.user,
              self: false,
              name: "",
            };
            // let formData = {
            //   userID: socket.userID,
            //   user: newUser
            // }
            // fetch('http://localhost:4000/addusers', {
            //   method: "POST",
            //   headers: {
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify(formData)
            // })
            // .then(response => response.json())
            // .then(result => {
            //   console.log(result);
            // })
            // .catch(err => {
            //   console.log(err, 'from fetch with addusers');
            // })

            setUsers((previous) => {
              return [...previous, newUser];
            });
          }
          setSomeEvents(newMessage);
        });
      }
      //condition where message is coming from a known user
      else {
        setSomeEvents(newMessage);
      }
    }

    socket.on("some-event", onSomeEvent);

    return () => {
      socket.off("some-event", onSomeEvent);
    };
  }, [users]);

  //used for handling the users coming from socket instance
  useEffect(() => {
    const onGetUser = (userData) => {
      if (userValidityCheck(users, userData.user.userID)) return;
      let newUser = {
        ...userData.user,
        self: false,
        name: "",
      };
      let formData = {
        userID: socket.userID,
        user: newUser,
      };
      fetch("http://localhost:4000/addusers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err, "from fetch with addusers");
        });

      setUsers((previous) => {
        return [...previous, newUser];
      });
    };

    socket.on("add-user", onGetUser);

    return () => {
      socket.off("add-user", onGetUser);
    };
  }, []);

  const userNameChangeHandler = (name) => {
    setUserName(name);
  };

  const eventHandler = (message, b, selectedUser) => {
    socket.emit("some-event", message, socket.userID, selectedUser);
  };

  const selectedUserHandler = (id) => {
    setSelectedUser(id);
  };

  const displayBackdropHandler = () => {
    setDisplayBackdrop((previous) => {
      return !previous;
    });
  };

  return (
    <div className="App">
      <Backdrop
        displayHandler={displayBackdropHandler}
        classDetails={displayBackdrop}
      ></Backdrop>
      <Modal
        displayHandler={displayBackdrop}
        displayChangeHandler={displayBackdropHandler}
      >
        <AddUser></AddUser>
      </Modal>
      <Routes>
        <Route
          path="/"
          element={<Homepage changeHandler={userNameChangeHandler}></Homepage>}
        ></Route>
        {userName ? (
          <Route
            path="/main"
            element={
              <ChatWindow
                backDropHandler={displayBackdropHandler}
                connection={isConnected}
                newMessage={someEvents}
                selectedUser={selectedUser}
                selectedUserHandler={selectedUserHandler}
                users={users}
                eventHandler={eventHandler}
              ></ChatWindow>
            }
          ></Route>
        ) : (
          ""
        )}
        <Route path="*" element={<Navigate to="/"></Navigate>}></Route>
      </Routes>
    </div>
  );
}

export default App;
