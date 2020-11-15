import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useState } from 'react';
import { useEffect } from 'react';

const Signup = () => {
    const history = useHistory();
    const { register, handleSubmit, watch, errors } = useForm();
    const [error, setError] = useState();
    const [success, setSuccess] = useState();
    const [userData, setUserData] = useState(false);

    const onSubmit = signupData => {
        let data = {
            name: signupData.name,
            email: signupData.email,
            password: signupData.password,
        }
        const imageData = new FormData();
        imageData.append("file", signupData.file['0']);
        imageData.append("upload_preset", "instagram_clone");
        imageData.append("cloud_name", "mdestiakahmed");

        if(signupData.file.length === 1){
            fetch('https://api.cloudinary.com/v1_1/mdestiakahmed/image/upload', {
                method: 'POST',
                body: imageData,
            })
            .then(res => res.json())
            .then(result => {
                if(result.secure_url){
                    data.photo = result.secure_url;
                    setUserData(data);
                }
            })
            .catch(error => {
                console.log(error);
            })
        }
        else{
            setUserData(data);
        }
    }
    
    useEffect(() => {
        if(userData){
            fetch('http://localhost:5000/signup', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(userData),
            })
            .then(res => res.json())
            .then(data => {
                if(data.status){
                    setError();
                    setSuccess(data.message);
                    setTimeout(() => {
                        history.push('/login');
                    }, 2000);
                }
                else{
                    setError(data.message);
                }
            })
            .catch(error => {
                setError(error);
            })
        }
    }, [userData])

    return (
        <div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-5">
                        <div className="card mt-5">
                            <div className="card-body">
                                <h5 className="card-title logo text-center">instagram</h5>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="input_box mb-3">
                                        <input type="text" ref={register({ required: true })} name="name" id="name" className="input_field border-0" placeholder="enter your name"/>
                                    <span className="text-danger text-left">{errors.name && "name is required"}</span>
                                    </div>
                                    <div className="input_box mb-3">
                                        <input type="email" ref={register({ required: true })} name="email" id="email" className="input_field border-0" placeholder="enter your email"/>
                                        <span className="text-danger text-left">{errors.email && "email is required"}</span>
                                    </div>
                                    <div className="input_box mb-3">
                                        <input type="password" ref={register({ required: true })} name="password" id="password" className="input_field border-0" placeholder="enter your password"/>
                                        <span className="text-danger text-left">{errors.password && "password is required"}</span>
                                    </div>
                                    <div className="input_box mb-3">
                                        <input type="file" ref={register} name="file" id="file" className="input_field border-0 form-control-file" id="photo" />
                                    </div>
                                    <div><input type="submit" value="signup" className="btn btn-primary btn-lg btn-block"/></div>
                                    {/* {
                                        error ?
                                        <div className="alert alert-danger mt-3" role="alert">
                                            {error}
                                        </div> :
                                        null
                                    } */}
                                    {
                                        success ?
                                        <div className="alert alert-success mt-3" role="alert">
                                            {success}
                                        </div> :
                                        null
                                    }
                                </form>
                            </div>
                        </div>

                        <div className="card text-center mt-2">
                            <div className="card-body">
                                <h6 className="card-title">
                                    already have a account? <Link to="/login" className="btn_line text-primary d-inline">login</Link>
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;