import { getApp,getApps,initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC789nvoarbKpvu3v0HD-DJHQ72YyzL7Qw",
  authDomain: "onlinemovieticketes.firebaseapp.com",
  projectId: "onlinemovieticketes",
  storageBucket: "onlinemovieticketes.appspot.com",
  messagingSenderId: "398017208741",
  appId: "1:398017208741:web:e970ebe3e15e737417084c",
  measurementId: "G-BX28EW4Y2F"
};

const app =getApps.length>0?getApp(): initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app); 



export {app,auth,firestore};