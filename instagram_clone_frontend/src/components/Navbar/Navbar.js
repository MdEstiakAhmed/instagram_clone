import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Navbar.css';
import {UserContext} from '../../App';

const Navbar = () => {
    const history = useHistory();
    const {state, dispatch} = useContext(UserContext);


    const logoutProcess = () => {
        localStorage.clear();
        dispatch({type: "CLEAR", payload: null});
        // history.push('/login');
        window.location.href = "/login";
    }

    const navbarList = () => {
        if(!state){
            return ([
                <Link to="/create" className="nav-item nav-link">create post</Link>,
                <Link to="/profile" className="nav-item nav-link">profile</Link>,
                <button className="btn btn-danger" onClick={logoutProcess}>logout</button>
            ]);
        }
        else{
            return ([
                <Link to="/signup" className="nav-item nav-link">signup</Link>,
                <Link to="/login" className="nav-item nav-link">login</Link>
            ]);
        }
    }
    return (
        <div className=''>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link className="navbar-brand logo" to={!state ? '/' : '/login'}>instagram</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav ml-auto">
                            {navbarList()}
                            
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;