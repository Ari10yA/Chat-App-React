import React from "react";
import UsersWindow from "./userswindow/usersWindow";
import UserChat from "./userChat/userChat"

import classes from "./chatwindow.module.css";

const ChatWindow = (props) => {

    return(
        <div className={classes.main_window}>
            <UsersWindow newMessage={props.newMessage} backDropHandler={props.backDropHandler} selectedUserHandler={props.selectedUserHandler} selectedUser={props.selectedUser} users={props.users}></UsersWindow>
            <UserChat  newMessage={props.newMessage} selectedUser={props.selectedUser} users={props.users} eventHandler={props.eventHandler}></UserChat>
        </div>
    )
}

export default ChatWindow;