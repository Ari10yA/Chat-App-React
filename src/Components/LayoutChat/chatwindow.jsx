import React from "react";
import UsersWindow from "./userswindow/usersWindow";
import UserChat from "./userChat/userChat";
import { useState, useEffect } from "react";
import socket from "../../socket";

import classes from "./chatwindow.module.css";

const ChatWindow = (props) => {

    const [chats, setChats] = useState(new Map());

    useEffect(() => {
        if(props.connection == true){
            let payLoad = {
                senderID: socket.userID
            }
            fetch('http://localhost:4000/fetchmessages', {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(payLoad)
            })
            .then((res) => {
                return res.json();
            })
            .then(response=> {
                if(response.data.length>0){
                    let updatedMap = new Map();
                    response.data.forEach((res) => {
                        updatedMap.set(res.toID, [...res.msgs]);
                    });
                    let existingUsers = props.users.map((user) => user.userID);

                    existingUsers.forEach((userID) => {
                        if(!updatedMap.has(userID)){
                            updatedMap.set(userID, []);
                        }
                    })

                    setChats(updatedMap);
                }
            })
            .catch(err => {
                console.log(err, 'from catch block');
            })
        }     
    }, [props.connection]);

    useEffect(() => {
        if(props.connection){
            setChats((prev) => {
                let updatedMap = new Map([
                    ...prev.entries()
                ]);
                let existingUsers = props.users.map((user) => user.userID);
    
                existingUsers.forEach((userID) => {
                    if(!updatedMap.has(userID)){
                        updatedMap.set(userID, []);
                    }
                })
                return updatedMap;
            })
        }
    }, [props.users, props.connection]);


    useEffect(() => {
        if(props.newMessage){
            setChats(previous => {
                let newState = new Map(previous);
                
                //in this case message's sender is same of the user so it will check for which user it is sent 
                if(props.newMessage.userID == socket.userID){
                    //from and to both are same user (self message)
                    if(props.newMessage.toID==props.newMessage.userID){
                        newState.set(props.newMessage.userID, [...newState.get(props.newMessage.userID), { 
                            message: props.newMessage.message,
                            self: true
                        }])
                        return newState;
                    }
                    //from the same user but to different user
                    newState.set(props.newMessage.toID, [...newState.get(props.newMessage.toID), { 
                        message: props.newMessage.message,
                        self: true
                    }])
                    return newState;
                }
                newState.set(props.newMessage.userID, [...newState.get(props.newMessage.userID), { 
                    message: props.newMessage.message,
                    self: false
                }])
                return newState
            });
        }
    }, [props.newMessage])


    return(
        <div className={classes.main_window}>
            <UsersWindow newMessage={props.newMessage} backDropHandler={props.backDropHandler} selectedUserHandler={props.selectedUserHandler} selectedUser={props.selectedUser} users={props.users}></UsersWindow>
            <UserChat chats={chats} connection={props.connection}  newMessage={props.newMessage} selectedUser={props.selectedUser} users={props.users} eventHandler={props.eventHandler}></UserChat>
        </div>
    )
}

export default ChatWindow;