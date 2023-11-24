import React, { useState } from "react";
import socket from "../../socket";

const AddUser = (props) => {
    const [userInput, setUserInput] = useState('')
    
    const formSubmitHandler = (event) => {
        event.preventDefault();
        socket.emit('add-user-req', userInput);
        props.displayChangeHandler();
    }


    return (
        <div>
            <form onSubmit={formSubmitHandler}>
                <input onChange={(event) => {setUserInput(event.target.value)}}></input>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default AddUser;