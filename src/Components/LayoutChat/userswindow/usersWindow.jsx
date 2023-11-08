import React from "react";
import User from "./User/user"

import classes from "./usersWindow.module.css"

const UsersWindow = (props) => {

    return(
        <div className={classes.users_window}>
            <User></User>
        </div>
    )
}

export default UsersWindow;