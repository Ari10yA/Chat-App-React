import React from "react";


import classes from "./user.module.css"

const User = (props) => {
    return(
        <div className={classes.user_window}>
            <span style={{color: "white", display: "block"}}>{props.userName}</span>
            <span style={{color: "greenyellow"}}>Online</span>
        </div>
    )
}

export default User;