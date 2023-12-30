import React from "react";
import User from "./User/user"
import { useState, useEffect } from "react";
import socket from "../../../socket";

import classes from "./usersWindow.module.css";

const UsersWindow = (props) => {

    let users;
    if(props.users){
        users = props.users.map(user => {
            return <User newMessage={props.newMessage} selectedUser={props.selectedUser} clickHandler={() => props.selectedUserHandler(user.userID)} key={user.userID} id={user.userID} userName={user.username} self={user.self} isConnected={user.isConnected}></User>
        })
    }


    return(
        <div className={classes.users_window}>
            <button className={classes.button} onClick={() => {props.backDropHandler()}}>Add User</button>
            {users}
        </div>
    )
}

export default UsersWindow;