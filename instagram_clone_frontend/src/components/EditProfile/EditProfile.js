import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { UserContext }  from '../../App';

const EditProfile = () => {
    const history = useHistory();
    const {state, dispatch} = useContext(UserContext);
    const { register, handleSubmit, watch, errors } = useForm();
    const [error, setError] = useState();
    const [success, setSuccess] = useState();
    const [userData, setUserData] = useState();

    const onSubmit = updateData => {
        if(updateData){
            let formData = {
                name: updateData.name,
                email: updateData.email,
                password: updateData.password,
            }
            fetch('http://localhost:5000/user/passwordCheck', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + JSON.parse(localStorage.getItem('jwt'))
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({password: updateData.password}),
            })
            .then(res => res.json())
            .then(data => {
                if(data.status){
                    setError(null);
                    if(updateData.new_password){
                        formData.password = updateData.new_password
                    }
                    if(updateData.file.length === 1){
                        const imageData = new FormData();
                        imageData.append("file", updateData.file['0']);
                        imageData.append("upload_preset", "instagram_clone");
                        imageData.append("cloud_name", "mdestiakahmed");

                        fetch('https://api.cloudinary.com/v1_1/mdestiakahmed/image/upload', {
                            method: 'POST',
                            body: imageData,
                        })
                        .then(res => res.json())
                        .then(result => {
                            if(result.secure_url){
                                formData.photo = result.secure_url;
                                setUserData(formData);
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    }
                    else{
                        setUserData(formData);
                    }
                }
                else{
                    setError(data.message);
                }
            })
            .catch(error => {
                setError(error);
            })
        }
    }

    useEffect(() => {
        if(userData){
            console.log(userData);
        }
    }, [userData])

    return (
        <div className="container mt-3">
            {
                error ?
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div> :
                null
            }
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input_box mb-3">
                    <input type="text" defaultValue={state ? state.name : null} ref={register({ required: true })} name="name" id="name" className="input_field border-0" placeholder="enter your name"/>
                <span className="text-danger text-left">{errors.name && "name is required"}</span>
                </div>
                <div className="input_box mb-3">
                    <input type="email" defaultValue={state ? state.email : null} ref={register({ required: true })} name="email" id="email" className="input_field border-0" placeholder="enter your email"/>
                    <span className="text-danger text-left">{errors.email && "email is required"}</span>
                </div>
                <div className="input_box mb-3">
                    <input type="password" ref={register({ required: true })} name="password" id="password" className="input_field border-0" placeholder="enter your password"/>
                    <span className="text-danger text-left">{errors.password && "password is required"}</span>
                </div>
                <div className="input_box mb-3">
                    <input type="password" ref={register} name="new_password" id="new_password" className="input_field border-0" placeholder="enter new password (optional)"/>
                </div>
                <div className="input_box mb-3">
                    <label htmlFor="file"><b>update profile image (optional)</b></label>
                    <input type="file" ref={register} name="file" id="file" className="input_field border-0 form-control-file" id="photo" />
                </div>
                <div><input type="submit" value="signup" className="btn btn-primary"/></div>
                
                {
                    success ?
                    <div className="alert alert-success mt-3" role="alert">
                        {success}
                    </div> :
                    null
                }
            </form>
        </div>
    );
};

export default EditProfile;