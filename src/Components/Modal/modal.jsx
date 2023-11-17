import React from "react";

import classes from "./modal.module.css"

const Modal = (props) => {
    return (
        <div className={classes.modal}>
            <button>Logout</button>
        </div>
    )
}

export default Modal;