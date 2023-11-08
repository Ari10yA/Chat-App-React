import React from "react";
import UsersWindow from "./userswindow/usersWindow";
import UserChat from "./userChat/userChat"

import classes from "./chatwindow.module.css";

const ChatWindow = (props) => {

    return(
        <div className={classes.main_window}>
            <UsersWindow></UsersWindow>
            <UserChat></UserChat>
        </div>
    )
}

export default ChatWindow;