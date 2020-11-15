import React, { useState, useEffect, useContext } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { UserContext }  from '../../App';
import { Link } from 'react-router-dom';

const SuggestedUser = () => {
    const [userList, setUserList] = useState([]);
    const {state, dispatch} = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:5000/user/getSuggestedUser', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + JSON.parse(localStorage.getItem('jwt'))
            },
        })
            .then(res => res.json())
            .then(data => {
                setUserList(data);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    const handleFollow = (id) => {
        fetch('http://localhost:5000/user/follow', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + JSON.parse(localStorage.getItem('jwt'))
            },
            body: JSON.stringify({followingId: id}),
        })
        .then(res => res.json())
        .then(result => {
            if(result.status){
                setUserList(userList.filter(user => user._id !== id));
                delete result.data.password;
                dispatch({type: "UPDATE", payload: result.data});
                localStorage.setItem('user', JSON.stringify(result.data));
            }
        })
        .catch(error => {
            console.log(error);
        })
    }
    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header"><h2>Suggestions</h2></div>
            </div>
            <div className="card-body">
                {
                userList.length > 0 ?
                userList.map(user => {
                    return (
                        <div className="row justify-content-between m-1 border-bottom border-light" key={user._id}>
                            <div className="col-4">
                                <h5><FaUserCircle className="icon mr-3" /><Link to={`/profile/${user._id}`} className="link text-dark">{user.name}</Link></h5>
                            </div>
                            <div className="col-4 text-right m-1">
                                <button className="btn btn-primary btn-sm" onClick={() =>handleFollow(user._id)}>follow</button>
                            </div>
                        </div>
                    )
                }) :
                null
            }
            </div>
        </div>
    );
};

export default SuggestedUser;


