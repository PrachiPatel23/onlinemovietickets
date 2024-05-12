import React, { useEffect, useState } from 'react';
import '../Style/Login.css'; // Import external CSS file
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../api/fiebase.config.js';

export default function Login() {
    const navigate =useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const gotoSignup = () =>{
    navigate('/signup');
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
   await signInWithEmailAndPassword(auth,email,password).then((userCred)=>{
    console.log("SignIn Successfull");
   })
  };

  useEffect(()=>{
    auth.onAuthStateChanged((userCred)=>{
      if(userCred){
        document.cookie = `email=${email}; path=/;`;
      if(userCred.emailVerified){
        navigate('/');
      }
      }
    })
  },[]);
  return (
    <div className="loginContainer">
      <h2 className="appName">Movies</h2>
      <h3 className="loginText">Login</h3>
      <form className="loginForm" onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit" className="signInButton">Sign In</button>
      </form>
      <div className="signupButtonContainer">
        <span>Don't have an account?</span>
        <button className="signupButton1" onClick={gotoSignup}>Sign Up</button>
      </div>
    </div>
  );
}
