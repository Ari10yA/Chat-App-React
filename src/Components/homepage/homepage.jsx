import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';

import classes from "./homepage.module.css";

const Homepage = (props) => {
    const [username, setUserName] = useState('');
    // const [isLoading, setLoding] = useState(false);
    const navigate = useNavigate();

    
    const usernameChangeHandler = (event) => {
        setUserName(event.target.value)
    }

    const submitFormHandler = (event) =>{
        event.preventDefault();
        props.changeHandler(username);
        navigate('/main');
    }
    
    
    return (
        <div className={classes.homepage}>       
            <form className={classes.form} onSubmit={submitFormHandler}>
                <p className={classes.title}>ChatApp</p>
                <input className={classes.form_input} type="text" name="username" onChange={usernameChangeHandler.bind(this)}></input>
                <button className={classes.form_btn} type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Homepage;