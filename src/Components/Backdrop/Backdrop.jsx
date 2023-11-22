import React from "react";
import { useState, useEffect } from "react";

import classes from './backdrop.module.css'

const Backdrop = (props) => {

    const [classList, setClassList] = useState([]);

    useEffect(() => {
        let updatedClassList = [];

        updatedClassList.push(classes.backdrop);
        if (props.classDetails) {
            setClassList((prevClassList) => {
                updatedClassList = [...prevClassList, classes.display];

                setTimeout(() => {
                    setClassList((prevClassList) => [...prevClassList, classes.display_transition]);
                }, 100);

                return updatedClassList;
            });
        }
        else{
            setClassList(updatedClassList);
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