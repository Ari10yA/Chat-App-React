import React from "react";
import { useState, useEffect } from "react";

import classes from './backdrop.module.css'

const Backdrop = (props) => {

    const [classList, setClassList] = useState([classes.backdrop]);

    useEffect(() => {
        if (props.classDetails) {
            setClassList((prevClassList) => {
                const updatedClassList = [...prevClassList, classes.display];

                setTimeout(() => {
                    setClassList((prevClassList) => [...prevClassList, classes.display_transition]);
                }, 200);

                return updatedClassList;
            });
        }
    }, [props.classDetails]);

    const classListString = classList.join(' ');

    return (
        <div className={classListString}  onClick={() => {props.displayHandler()}}>
            {props.children}
        </div>
    )
}

export default Backdrop;
