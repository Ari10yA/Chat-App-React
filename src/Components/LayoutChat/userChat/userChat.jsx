import React from "react";

import classes from "./userChat.module.css";

const UserChat = (props) => {

    return(
        <div className={classes.chat_window}>
            <div className={classes.chat_window__header}>
                <p style={{margin: "0"}}>User</p>
                <span>Online</span>
            </div>
            <div className={classes.chat_window__chats}>
                <div className={classes.chat_window__chats__self}>Hello</div>
                <div className={classes.chat_window__chats__other}>Hii!</div>
            </div>
            
            <form className={classes.chat_window__form}>
                <input type="text"></input>
                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default UserChat;