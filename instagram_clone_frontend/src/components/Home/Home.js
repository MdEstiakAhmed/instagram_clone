import React, { useState, useEffect} from 'react';
import { FaRegHeart, FaLocationArrow } from "react-icons/fa";
import './Home.css';

const Home = () => {
    const [data, setData] = useState([]);
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
            }
            else{
                setData([]);
            }
        })
        .catch(error => {
            console.log(error);
        })
    }, [])
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
                                            <button className="icon_btn">
                                                <FaRegHeart className="icon" />
                                            </button>
                                            <h6 className="card-title">245 likes</h6>
                                            <div>
                                            <b className="card-title">{item.body} </b><p className="card-text d-inline"></p>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <div className="row">
                                                <div className="col-10">
                                                    <input type="text" className="input_field" placeholder="Add a comment" />
                                                </div>
                                                <div className="col-2 text-right">
                                                    <button className="icon_btn">
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