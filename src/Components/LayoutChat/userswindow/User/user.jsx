import React from "react";


import classes from "./user.module.css"

const User = (props) => {

    let classList = []
    classList.push(classes.user_window);
    if(props.selectedUser==props.id) classList.push(classes.user_window_selected)


    let text = "online";
    if(!props.isConnected){
        text= "offline";
    }

    return(
        <div onClick={() => props.clickHandler()} className={classList.join(' ')}>
            <span style={{color: "white", display: "block"}}>{props.userName}{props.self ? '(Yourself)' : ''}</span>
            <span style={{color: props.isConnected? "greenyellow" : "red"}}>{text}</span>
        </div>
    )
}

export default User;