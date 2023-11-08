import React from "react";
import UsersWindow from "./userswindow/usersWindow";
import UserChat from "./userChat/userChat"

import classes from "./chatwindow.module.css";

const ChatWindow = (props) => {

    return(
        <div className={classes.main_window}>
            <UsersWindow userName={props.userName}></UsersWindow>
            <UserChat userName={props.userName}></UserChat>
        </div>
    )
}

export default ChatWindow;