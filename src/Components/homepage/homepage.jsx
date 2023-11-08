import React, {useState} from "react";

import classes from "./homepage.module.css";

const Homepage = (props) => {
    const [username, setUserName] = useState('');
    const [isLoading, setLoding] = useState(false);

    
    const usernameChangeHandler = (event) => {
        setUserName(event.target.value)
    }
    
    console.log(username);
    
    return (
        <div className={classes.homepage}>       
            <div className={classes.form}>
                <p className={classes.title}>ChatApp</p>
                <input className={classes.form_input} type="text" name="username" onChange={usernameChangeHandler.bind(this)}></input>
                <button className={classes.form_btn}>Submit</button>
            </div>
        </div>
    )
}

export default Homepage;