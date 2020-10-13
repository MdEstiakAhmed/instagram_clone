import React, { useEffect, createContext, useReducer, useContext} from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Profile from './components/Profile/Profile';
import CreatePost from './components/CreatePost/CreatePost';
import {initialState, reducer} from './reducers/UserReducer';

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const {state, dispatch} = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
      dispatch({type: "USER", payload: user});
    }
    else{
      history.push('/login');
    }
  }, [])
  return(
    <Switch>
      <Route exact path="/">
        <Home/>
      </Route>
      <Route exact path="/login">
        <Login/>
      </Route>
      <Route exact path="/signup">
        <Signup/>
      </Route>
      <Route exact path="/profile">
        <Profile/>
      </Route>
      <Route exact path="/create">
        <CreatePost/>
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer,initialState);
  return (
    <div className="App">
      <UserContext.Provider value={{state, dispatch}}>
        <Router>
          <Navbar />
          <Routing/>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
