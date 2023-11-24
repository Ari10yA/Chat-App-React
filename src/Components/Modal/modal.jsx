import React from "react";
import { cloneElement } from "react";

import classes from "./modal.module.css"

const Modal = (props) => {
    
    let classList = [];
    classList.push(classes.modal);

    if(props.displayHandler) classList.push(classes.modal_show);
    
    return (
        <div className={classList.join(' ')}>
            {cloneElement(props.children, {...props})}
        </div>
    )
}

export default Modal;