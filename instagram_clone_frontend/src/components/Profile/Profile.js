import React, { useState, useEffect, useContext} from 'react';
import './Profile.css';
import { UserContext }  from '../../App';
import { Link } from 'react-router-dom';
import { AiFillSetting } from "react-icons/ai";

const Profile = () => {
    const [userPost, setUserPost] = useState([]);
    const {state, dispatch} = useContext(UserContext);

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
                        <img src={state && state.photo ? state.photo : 'https://res.cloudinary.com/mdestiakahmed/image/upload/v1605092094/unknown.png'} className="img-thumbnail rounded-circle w-50" alt="loading..."/>
                    </div>
                    <div className="col-4 align-self-center">
                        {
                            state ? 
                            <>
                                <div className="row justify-content-between mb-3">
                                    <div className="col-4">
                                        <h3>{state ? state.name : null}</h3>  
                                    </div>
                                    <div className="col-4 text-right"><Link className="mr-3 text-dark setting" to="/editProfile"><AiFillSetting/></Link></div>
                                </div>
                                <div className="row">
                                    <div className="col-4"><b>{userPost.length} </b><span className="bg-light p-1 rounded"> posts</span></div>
                                    <div className="col-4"><b>{state.followers.length}</b> <Link to="/followerList" className="text-dark link bg-light p-1 rounded">follower</Link></div>
                                    <div className="col-4"><b>{state.followings.length}</b> <Link to="/followingList" className="text-dark link bg-light p-1 rounded">following</Link></div>
                                </div>
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

export default Profile;