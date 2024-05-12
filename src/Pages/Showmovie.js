import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Component/Header";
import { auth } from "../api/fiebase.config";
import { movies } from "../movies.js";
import "../Style/Showmovies.css";
import { Dot, Star } from "lucide-react";
export default function Showmovie() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [movie, setMovie] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
    const foundMovie = movies.find((movie) => movie.imdbID === params.movieId);
    setMovie(foundMovie);
  }, [params.movieId]);


  const booktickets = () =>{
    alert("Sorry Were are out of the service for sometimes");
  }
  return (
    <>
      <Header email={user ? user.email : null} />
      {movie && (
        <div>
          <div className="background"  style={{ 
          backgroundImage: `url(${movie.Images[0]})`
        }}></div>
          <div className="maindetails">
            <div className="poster1">
              <img src={movie.Poster} alt="" className="imageposter" />
            </div>
            <div className="details">
              <h1 className="moviename">{movie.Title}</h1>
              <h2 className="rating"><Star style={{ marginRight: '5px', fill: "#FFC53D", color: "transparent" }} />{movie.imdbRating} {" ("}{movie.imdbVotes}{") Votes"}</h2>
              <h3 className="language">{movie.Language}</h3>
              <div className="timelineandactions">
                <h3>{movie.Runtime}</h3>
                <Dot style={{color:"white"}}/>
                <h3>{movie.Genre}</h3>
                <Dot style={{color:"white"}}/>
                <h3>{movie.Rated}</h3>
                <Dot style={{color:"white"}}/>
                <h3>{movie.Released}</h3>
              </div>
             {!movie.ComingSoon?<button className="booktickets" onClick={()=>booktickets()}>Book Tickets</button>:<p className="booktickets">Comming Soon </p>}
            </div>
          </div>
          <div className="aboutmovie">
          <div className="plot">
          <h2 className="aboutmovietxt">About this Movie</h2>
          <h3 className="movieplot">{movie.Plot}</h3>
          </div>
          <div className="cast">
          <h2 className="aboutmovietxt">Cast</h2>
          <h3 className="movieplot">{movie.Actors}</h3>
          </div>
          </div>
        </div>
      )}
    </>
  );
}
