import React from "react";
import User from "./User/user"

import classes from "./usersWindow.module.css"

const UsersWindow = (props) => {
    let users = props.users.map(user => {
        return <User selectedUser={props.selectedUser} clickHandler={() => props.selectedUserHandler(user.userID)} key={user.userID} id={user.userID} userName={user.username} self={user.self}></User>
    })

    return(
        <div className={classes.users_window}>
            {users}
        </div>
    )
}

export default UsersWindow;