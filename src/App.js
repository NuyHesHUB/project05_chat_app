import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setUser, clearUser } from "./redux/actions/user_action";

function App() {
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log('user', user);
      if (user) {
        navigate("/");
        dispatch(setUser(user));

        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // eslint-disable-next-line no-unused-vars
        const uid = user.uid;
        // ...
      }
      else {
        navigate("/login");
        /* redux 유저정보 없애기 */
        dispatch(clearUser());
        // User is signed out
        // ...
      } 
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <div 
      style={{
        width:'100vw',
        height:'100vh', 
        display:'flex', 
        alignItems:'center', 
        justifyContent:'center', 
        background:'#0e101c'
      }}>
          <span 
            style={{
              fontSize:'30px', 
              color:'#ec5990', 
              fontWeight:'bold'
            }}>LOADING
          </span>
        </div>;
  } else {
    return (
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  }
}

export default App;
