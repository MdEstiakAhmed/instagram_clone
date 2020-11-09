import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const CreatePost = () => {
    const { register, handleSubmit, watch, errors } = useForm();
    const history = useHistory();
    const [error, setError] = useState();
    const [isLoading, setLoading] = useState(false);

    const onSubmit = postData => {
        const imageData = new FormData();
        imageData.append("file", postData.file['0']);
        imageData.append("upload_preset", "instagram_clone");
        imageData.append("cloud_name", "mdestiakahmed");
        setLoading(true);

        fetch('https://api.cloudinary.com/v1_1/mdestiakahmed/image/upload', {
            method: 'POST',
            body: imageData,
        })
        .then(res => res.json())
        .then(data => {
            if(data.secure_url){
                fetch('http://localhost:5000/post/createPost', {
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
                    body: JSON.stringify({'photo': data.secure_url, 'body': postData.body}),
                })
                .then(res => res.json())
                .then(data => {
                    if(data.status){
                        setLoading(false);
                        history.push('/');
                    }
                    else{
                        setLoading(false);
                        setError(data.message);
                    }
                })
                .catch(error => {
                    setLoading(false);
                    setError(data.message);
                })
            }
            else{
                setLoading(false);
                setError("Photo upload failed");
            }
        })
        .catch(error => {
            setLoading(false);
            setError(error);
            history.push('/create');
            console.log(error);
        })
    }
    return (
        <div>
            <div className="container">
                <div className="card mt-5 w-75 ml-auto mr-auto">
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="body">title</label>
                                <input type="text" ref={register} name="body" id="body" className="form-control" id="body" placeholder="title"/>
                            </div>

                            <div className="form-group">
                                <label htmlFor="photo">photo</label>
                                <input type="file" ref={register} name="file" id="file" className="form-control-file" id="photo" required/>
                            </div>
                            {
                                isLoading ?
                                <Button variant="primary" disabled={isLoading}>Loading…</Button> :
                                <button type="submit" className="btn btn-primary">post</button>                          
                            }
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
            </div>
        </div>
    );
};

export default CreatePost;