import React, { useState, useContext } from 'react';
import './Login.css';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import {UserContext} from '../../App';

const Login = () => {
    const {state, dispatch} = useContext(UserContext);
    const { register, handleSubmit, watch, errors } = useForm();
    const history = useHistory();
    const [error, setError] = useState();

    const onSubmit = data => {
        fetch('http://localhost:5000/login', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data),
        })
        .then(res => res.json())
        .then(data => {
            if(data.status){
                setError();
                localStorage.setItem('jwt', JSON.stringify(data.token));
                localStorage.setItem('user', JSON.stringify(data.user));
                dispatch({type: "USER", payload: data.user});
                history.push('/');
            }
            else{
                setError(data.message);
            }
        })
        .catch(error => {
            setError(error);
        })
    }

    return (
        <div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-5">
                        <div className="card text-center mt-5">
                            <div className="card-body">
                                <h5 className="card-title logo">instagram</h5>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="input_box mb-3">
                                        <input type="email" ref={register} name="email" id="email" className="input_field border-0" placeholder="enter your email"/>
                                    </div>
                                    <div className="input_box mb-3">
                                        <input type="password" ref={register} name="password" id="password" className="input_field border-0" placeholder="enter your password"/>
                                    </div>
                                    <div><input type="submit" value="login" className="btn btn-primary btn-lg btn-block"/></div>
                                    {
                                        error ?
                                        <div className="alert alert-danger mt-3" role="alert">
                                            {error}
                                        </div> :
                                        null
                                    }
                                </form>
                            </div>
                        </div>

                        <div className="card text-center mt-2">
                            <div className="card-body">
                                <h6 className="card-title">
                                    don't have a account? <Link to="/signup" className="btn_line text-primary d-inline">signup</Link>
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;