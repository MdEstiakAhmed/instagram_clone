import React, { useState, useEffect} from 'react';
import './Profile.css';

const Profile = () => {
    const [userPost, setUserPost] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/post/getMyPost', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + JSON.parse(localStorage.getItem('jwt'))
            },
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            console.log(JSON.parse(localStorage.getItem('user'))['name']);
            if(data.status){
                setUserPost(data.data);
            }
            else{
                setUserPost([]);
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, [])
    return (
        <div>
            <div className="container mt-4">
                <div className="row justify-content-center border-bottom pb-5">
                    <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                        <img src="https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png" className="img-thumbnail rounded-circle w-50" alt="Responsive image"/>
                    </div>
                    <div className="col-4 align-self-center">
                        <h3>{JSON.parse(localStorage.getItem('user'))['name']}</h3>
                        <div className="row">
                            {userPost ? <div className="col-4"><b>{userPost.length}</b> posts</div> : <div className="col-4"><b>0</b> posts</div>}
                            <div className="col-4"><b>33</b> follower</div>
                            <div className="col-4"><b>33</b> following</div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4 text-center">
                    {
                        userPost.length > 0 ?
                        userPost.map(item => {
                            return(
                                <div className="mb-4 col-lg-4 col-md-4 col-sm-4 col-4" key={item._id}>
                                    <img src={item.photo} className="img-fluid" alt="" style={{width: 300, height: 300}}/>
                                </div>
                            );
                        }) :
                        null
                    }
                </div>
            </div>
        </div>
    );
};

export default Profile;