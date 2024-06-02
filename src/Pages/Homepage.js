import React, { useEffect, useState } from 'react'
import Header from '../Component/Header.jsx';
import drishyam from '../Images/drishyamposter.avif';
import fighter from '../Images/fighterposter.jpg';
import saitan from '../Images/shaitaanposter.avif';
import Slider from '../Component/Slider.jsx';
import { auth } from '../api/fiebase.config.js';
import Suggestion from '../Component/Suggestion.jsx';
export default function Homepage() {
  const images = [drishyam,fighter,saitan];
  const [user,setUser] = useState(null);

  useEffect(()=>{
    document.title = "Homepage - Movies"
   auth.onAuthStateChanged((user)=>{
    if(user){
      setUser(user);
    }
   })
  },[]);
  return (
    <>
    <Header email={user ? user.email : null}/>
    <Slider images={images}/>
    <Suggestion/>
    </>
  )
}
