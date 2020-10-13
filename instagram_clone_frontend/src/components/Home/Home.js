import React, { useState, useEffect, useContext} from 'react';
import { FaRegHeart, FaHeart, FaLocationArrow, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import './Home.css';
import { UserContext }  from '../../App';

const Home = () => {
    const [data, setData] = useState([]);
    const {state, dispatch} = useContext(UserContext);

    useEffect(() => {
        fetch('http://localhost:5000/post/getAllPost', {
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
                setData(data.data);
                console.log(data.data);
            }
            else{
                setData([]);
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, [])

    const postAction = (action, id, comment) => {
        fetch(action === "like" ? 'http://localhost:5000/post/like' :
            action === "dislike" ? 'http://localhost:5000/post/dislike' :
            action === "comment" ? 'http://localhost:5000/post/comment' :
            null, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + JSON.parse(localStorage.getItem('jwt'))
            },
            
            body: JSON.stringify({postId: id, text: comment}),
        })
        .then(res => res.json())
        .then(result => {
            console.log(result);
            if(result.status){
                const newData = data.map(item=>{
                    if(item._id==result.data["_id"]){
                        return result.data;
                    }else{
                        return item;
                    }
                })
                setData(newData);
                document.getElementById(id).value = "";
                
            }
        })
        .catch(error => {
            console.log(error);
        })
    }


    return (
        <div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10 col-sm-12 col-12 align-self-center">
                        {
                            data.length > 0 ?
                            data.map(item => {
                                return(
                                    <div className="card  mt-4 mb-4 home_post" key={item._id}>
                                        <div className="card-header"><b>{item['postCreator']['name']}</b></div>
                                        <img className="card-img-top" src={item.photo} alt="Card image cap" />
                                        <div className="card-body">
                                            {
                                                item.likes.includes(state._id) ?
                                                <FaHeart className="icon heart" /> :
                                                <FaRegHeart className="icon" /> 
                                            }
                                            <br/>
                                            {
                                               item.likes.includes(state._id) ? 
                                               <button className="icon_btn"  onClick={() => postAction("dislike", item._id)}>
                                                    <FaThumbsDown className="icon" />
                                                </button> :
                                                <button className="icon_btn"  onClick={() => postAction("like", item._id)}>
                                                <FaThumbsUp className="icon" />
                                            </button>
                                            }
                                            <h6 className="card-title">{item.likes.length} likes</h6>
                                            <div>
                                            <b className="card-title">{item.body} </b><p className="card-text d-inline"></p><br/><hr/>
                                            <b>comments</b>
                                            {
                                                item.comments.map((comment, index) => (
                                                    <p key={index}><b>{comment.commentUserName} </b>{comment.text}</p>
                                                ))
                                            }
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <div className="row">
                                                <div className="col-10">
                                                    <input type="text" id={item._id} className="input_field" placeholder="Add a comment" />
                                                </div>
                                                <div className="col-2 text-right">
                                                    <button className="icon_btn" onClick={() => postAction("comment", item._id, document.getElementById(item._id).value)}>
                                                        <FaLocationArrow className="icon m-0" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) :
                            null
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;