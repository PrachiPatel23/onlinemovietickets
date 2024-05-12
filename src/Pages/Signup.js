import React, { useEffect, useState } from 'react';
import '../Style/Signup.css';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../api/fiebase.config';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user,setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await createUserWithEmailAndPassword(auth,email,password).then(async(userCred)=>{
      const user = userCred.user;
      await sendEmailVerification(user);
      alert('Verification email has been sent to your email address. When You Verify the email then you will redirected at your page');
    }).catch((error) => {
      console.error('Error creating user:', error);
    })
    .finally(() => {
      setIsLoading(false); 
    });
  };

  useEffect(()=>{
    auth.onAuthStateChanged((userCred)=>{
      const {email,emailVerified} = userCred;
      console.log(user);
      setUser({email,emailVerified});
      document.cookie = `email=${email}; path=/;`;
      if(emailVerified){
        navigate('/');
      }
    })
  },[]);

  return (
    <div className="signupContainer">
      <h1 className="appName">Movies</h1>
      <form className="signupForm" onSubmit={handleSubmit}>
        <h2 className="signupText">Signup</h2>
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="inputfields"
          />
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="inputfields"
          />
        </div>
        <div className="formGroup">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="inputfields"
          />
        </div>
        {isLoading ? ( 
          <div className="loadingAnimation"></div>
        ) : (
          <button type="submit" className="signupButton">
            Signup
          </button>
        )}
      </form>
      <p className="loginText">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
