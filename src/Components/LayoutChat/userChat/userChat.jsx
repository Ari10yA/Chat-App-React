import React from "react";
import { useState, useEffect } from "react";

import classes from "./userChat.module.css";

const UserChat = (props) => {

    const [chatbox, setChatBox] = useState('');
    const [chats, setChats] = useState([]);

    const formSubmitHandler = (event) => {
        event.preventDefault();
        if(chatbox.length!==0){
            props.eventHandler(chatbox);
        }
        
        setChats(previous => {
            return [
                ...previous,
                {
                    message: chatbox,
                    by: "self"
                }
            ]
        });
        setChatBox('');
        console.log(chatbox);
    }

    let allChats = chats.map((chat, index) => {
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

    
    


    return(
        <div className={classes.chat_window}>
            <div className={classes.chat_window__header}>
                <p style={{margin: "0"}}>{props.userName}</p>
                <span>Online</span>
            </div>
            <div className={classes.chat_window__chats}>
                {
                    allChats
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