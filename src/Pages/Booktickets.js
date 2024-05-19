import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {firestore } from "../api/fiebase.config";
import { collection, getDocs } from "firebase/firestore";
import { movies } from "../movies.js";
import '../Style/Booktickets.css';
import { ChevronRight, IndianRupee, X } from "lucide-react";
import theaterContext from "../api/theaterContext.js";
export default function Booktickets() {
  const [theaterData, setTheaterData] = useState([]);
  const {theaterDatamain,setTheaterdatamain} = useContext(theaterContext);
  const params = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const foundMovie = movies.find((movie) => movie.imdbID === params.movieId);
    setMovie(foundMovie);
  }, [params.movieId]);

  useEffect(() => {
    const fetchTheaterData = async () => {
      try {
        const theatersCollectionRef = collection(firestore, "theaters");
        const snapshot = await getDocs(theatersCollectionRef);
        if (!snapshot.empty) {
          let theaterDataArray = snapshot.docs.map((doc) => doc.data());
          if (theaterDataArray.length === 0) {
            console.error("No theater data found.");
            return;
          }

          theaterDataArray = theaterDataArray[0];
          const key_array = Object.keys(theaterDataArray);
          const filterData = {};
          key_array.forEach((values) => {
            theaterDataArray[values].forEach((vals) => {
              if (vals.movieId == params.movieId) {
                filterData[values] = vals;
              }
            });
          });
          setTheaterData(filterData);
        } else {
          console.log("No documents found in 'theaters' collection.");
        }
      } catch (error) {
        console.error("Error getting documents:", error);
      }
    };

    fetchTheaterData();
  }, []);

  const gotoBooking = (theaterName,theaterData) =>{
    setTheaterdatamain({[theaterName]:theaterData});
    navigate(`/selectticktes/${params.movieId}`)
  }
  const handleClose = () =>{
    navigate(-1);
  }
  return (
    <>
      <div className="printdata">
      {movie && <div className="header">
          <div className="details">
          <h1 className="movietitle">{movie.Title ? movie.Title : "Movies"}</h1>
            <h4 className="Genre_book">{movie.Genre}</h4>
            <h4 className="rating_book">{movie.Rated}</h4>
          </div>
          <X className="close-icon" onClick={()=>handleClose()}/>
        </div>
}
        <div className="content">
      <h2 className="text1">Movie Avaiable in </h2>
        {Object.entries(theaterData).map(([theaterName, movieDetails]) => (
          <div key={theaterName} className="movies" onClick={()=>gotoBooking(theaterName,movieDetails)}>
            <h2 className="theatername">{theaterName}</h2>
            <ul className="aviabledetails">
              <li>Avaiable Seats : {movieDetails.avaiableSeat}</li>
              <li>Movie Id : {movieDetails.movieId}</li>
              <li>Tickets Price :{" "} <IndianRupee size={15}/>{movieDetails.ticketsPrice}</li>
            </ul>
            <ChevronRight className="rightarrow"/>
          </div>
        ))}
        </div>
      </div>
    </>
  );
}
