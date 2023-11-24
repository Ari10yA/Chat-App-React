import React from "react";
import socket from "../../socket";

import classes from "./logout.module.css";

const Logout = (props) => {
    const handleDisconnection = () => {
        socket.emit('disconnection-handler', (response) => {
            console.log(response);
        });
    }
    
    return (
        <>
            <button onClick={() => handleDisconnection()}>Logout</button>
        </>
            
    )
}

export default Logout;