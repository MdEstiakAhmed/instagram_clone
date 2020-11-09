import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {UserContext} from '../../App';

const UserProfile = () => {
    const {state, dispatch} = useContext(UserContext);
    const [userPost, setUserPost] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [followingStatus, setFollowingStatus] = useState(false);
    const {id} = useParams();

    useEffect(() => {
        // console.log(userInfo);
    }, [])

    useEffect(() => {
        fetch(`http://localhost:5000/post/getUserPost/${id}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + JSON.parse(localStorage.getItem('jwt'))
            },
        })
        .then(res => res.json())
        .then(data => {
            if(data.status){
                setUserPost(data.data);
                setUserInfo(data.data[0].postCreator);
                data.data[0].postCreator.followers.map(userId => {
                    if(userId == JSON.parse(localStorage.getItem('user'))._id){
                        setFollowingStatus(true);
                    }
                });
            }
            else{
                setUserPost([]);
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, [])

    const handleFollow = (action, followingId) => {
        fetch(action === "follow" ? 'http://localhost:5000/user/follow' :
        action === "unFollow" ? 'http://localhost:5000/user/unFollow' :
        null, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + JSON.parse(localStorage.getItem('jwt'))
            },
            body: JSON.stringify({followingId: followingId}),
        })
        .then(res => res.json())
        .then(result => {
            if(action === "follow"){
                setUserInfo({...userInfo, followers: [...userInfo.followers, state._id]});
                setFollowingStatus(true);
            }
            else{
                setUserInfo({...userInfo, followers: userInfo.followers.filter(id => id !== state._id)});
                setFollowingStatus(false);
            }
            delete result.data.password;
            dispatch({type: "UPDATE", payload: result.data});
            localStorage.setItem('user', JSON.stringify(result.data));
        })
        .catch(error => {
            console.log(error);
        })
    }
    return (
        <div>
            <div className="container mt-4">
                <div className="row justify-content-center border-bottom pb-5">
                    <div className="col-4 col-sm-4 col-md-4 col-lg-4">
                        <img src="https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png" className="img-thumbnail rounded-circle w-50" alt="Responsive image"/>
                    </div>
                    <div className="col-4 align-self-center">
                        {
                            userInfo ? 
                            <>
                                <h3>{userInfo ? userInfo.name : "loading..."}</h3>
                                <div className="row">
                                    <div className="col-4"><b>{userPost ? userPost.length : '...'}</b> posts</div>
                                    <div className="col-4"><b>{userInfo.followers ? userInfo.followers.length : '...'}</b> follower</div>
                                    <div className="col-4"><b>{userInfo.followers ? userInfo.followings.length : '...'}</b> following</div>
                                </div>
                                {
                                    followingStatus ? 
                                    <button className="btn btn-primary mt-3" onClick={() => handleFollow('unFollow',userInfo._id)}>Unfollow</button> : 
                                    !followingStatus ? 
                                    <button className="btn btn-primary mt-3" onClick={() => handleFollow('follow',userInfo._id)}>follow</button> :
                                    null
                                }
                                
                            </> : "loading..."
                        }
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

export default UserProfile;