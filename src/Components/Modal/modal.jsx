import React from "react";
import socket from "../../socket";

import classes from "./modal.module.css"

const Modal = (props) => {
    const handleDisconnection = () => {
        socket.emit('disconnection-handler', (response) => {
            console.log(response);
        });
    }
    
    return (
        <div className={classes.modal}>
            <button onClick={() => handleDisconnection()}>Logout</button>
        </div>
    )
}

export default Modal;