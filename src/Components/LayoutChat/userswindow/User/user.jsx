import React from "react";
import { useState, useEffect } from "react";

import classes from "./user.module.css"

const User = (props) => {
    const [newMessageCount, setNewMessageCount] = useState(0);

    useEffect(() => {
        if(props.newMessage){
            if(props.newMessage.userID == props.id && props.id !=props.selectedUser){
                setNewMessageCount(prev => prev+1);
            }
        }
    }, [props.newMessage])

    let classList = []
    classList.push(classes.user_window);

    let badgeClassList = [];
    badgeClassList.push(classes.user_window__badge);

    if(props.selectedUser==props.id){
        classList.push(classes.user_window_selected);
    } 

    if(props.selectedUser != props.id && newMessageCount>0 && !props.self){
        badgeClassList.push(classes.badge_show);
    }



    let text = "online";
    if(!props.isConnected){
        text= "offline";
    }

    const customClickHandler = () => {
        props.clickHandler();
        setNewMessageCount(0);
    }   

    return(
        <div onClick={() => customClickHandler()} className={classList.join(' ')}>
            <span style={{color: "white", display: "block"}}>{props.userName}{props.self ? '(Yourself)' : ''}</span>
            <span style={{color: props.isConnected? "greenyellow" : "red"}}>{text}</span>
            <div className={badgeClassList.join(' ')}>
                <span className={classes.badge_text}>{newMessageCount}</span>
            </div>
        </div>
    )
}

export default User;