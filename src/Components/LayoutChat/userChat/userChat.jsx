import React from "react";
import { useState, useEffect } from "react";
import socket from "../../../socket";

import classes from "./userChat.module.css";

const UserChat = (props) => {

    const [chatbox, setChatBox] = useState('');
    const [chats, setChats] = useState(new Map());
    const [selectedUser, setSelectedUser] = useState('')

    useEffect(() => {
        setSelectedUser(props.selectedUser);
    }, [props.selectedUser])

    useEffect(() => {
        let userArray = props.users.map((user) => {
            return user.userID
        })
        let updatedMap
        if(chats){
            let filteredMap = new Map([
                ...chats.entries(),
                ...userArray
                  .filter((key) => !chats.has(key))
                  .map((newKey) => [newKey, []]),
              ]);

            updatedMap = new Map(Array.from(filteredMap).filter(([key, value]) => userArray.includes(key)));
        }
        setChats(updatedMap);
       

    }, [props.users]);

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
                            by: "self"
                        }])
                        return newState;
                    }
                    //from the same user but to different user
                    newState.set(props.newMessage.toID, [...newState.get(props.newMessage.toID), { 
                        message: props.newMessage.message,
                        by: "self"
                    }])
                    return newState;
                }
                newState.set(props.newMessage.userID, [...newState.get(props.newMessage.userID), { 
                    message: props.newMessage.message,
                    by: "other"
                }])
                return newState
            });
        }
    }, [props.newMessage])

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if(chatbox.length!==0){
            props.eventHandler(chatbox, socket.userID, selectedUser );
        }
        
        // setChats(previous => {
        //     const newState = new Map(previous);

        //     newState.set(selectedUser, [...newState.get(selectedUser), { 
        //         message: chatbox,
        //         by: "self"
        //     }])
        //     return newState
        // });
        setChatBox('');
    }



    let userDetails = props.users.filter(user => {
        return user.userID==props.selectedUser;
    })
    
    let userElement;
    let allChats;
    let updatedChats;
    if(userDetails.length>0){
        userElement = 
        <>  
            <p style={{margin: "0"}}>{userDetails[0].username}</p>
            <span>Online</span>
        </>


        allChats = chats.get(selectedUser);
        if(allChats){
            updatedChats = allChats.map((chat, index) => {
                if(chat.by=="self"){
                    return (
                        <div key={index} className={classes.chat_window__chats__self}>
                            <span className={classes.chat_window__chats__self_message}>{chat.message}</span>
                        </div>
                    );
                }
                else{
                    return (
                        <div key={index} className={classes.chat_window__chats__other}>
                            <span className={classes.chat_window__chats__other_message}>{chat.message}</span>
                        </div>
                    );
                }
            })
        }

    }


    return(
        <div className={classes.chat_window}>
            <div className={classes.chat_window__header}>
                {userElement}           
            </div>
            <div className={classes.chat_window__chats}>
                {
                    updatedChats
                }                
            </div>
            
            <form className={classes.chat_window__form} onSubmit={formSubmitHandler}>
                <input type="text" onChange={(event) => {return setChatBox(event.target.value)}} value={chatbox}></input>
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default UserChat;