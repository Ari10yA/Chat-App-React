import React from "react";
import { useState, useEffect } from "react";

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
       

    }, [props.users])

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if(chatbox.length!==0){
            props.eventHandler(chatbox);
        }
        
        setChats(previous => {
            const newState = new Map(previous);

            newState.set(selectedUser, [...newState.get(selectedUser), { 
                message: chatbox,
                by: "self"
            }])
            return newState
        });
        setChatBox('');
        console.log(chatbox);
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

    

    //  chats.get()
        
    
    console.log(selectedUser);

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