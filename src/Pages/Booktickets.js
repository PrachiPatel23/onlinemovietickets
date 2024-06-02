import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { firestore } from "../api/fiebase.config";
import { doc, getDoc } from "firebase/firestore";
import { movies } from "../movies.js";
import "../Style/Booktickets.css";
import {X } from "lucide-react";
import theaterContext from "../api/theaterContext.js";
export default function Booktickets() {
  const [theaterData, setTheaterData] = useState({});
  const [hoveredShow, setHoveredShow] = useState({ theaterName: null, index: null });
  const {setTheaterdatamain } = useContext(theaterContext);
  const params = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    if(movie){
      document.title = `${movie?.Title} - Select Cinema`
    }
  },[movie]);

  useEffect(() => {
    const foundMovie = movies.find((movie) => movie.imdbID === params.movieId);
    setMovie(foundMovie);
  }, [params.movieId]);

  useEffect(() => {
    const fetchTheaterData = async () => {
      try {
        const theaterDocRef = doc(firestore, "theater", params.movieId);
        const docSnapshot = await getDoc(theaterDocRef);

        if (docSnapshot.exists()) {
          const theaterData = docSnapshot.data();
          setTheaterData(theaterData);
        } else {
          console.error("No theater data found for the given movieId.");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchTheaterData();
  }, [params.movieId]);

  const gotoBooking = (theaterName, theaterData) => {
    setTheaterdatamain({ [theaterName]: theaterData });
    navigate(`/selectticktes/${params.movieId}`);
  };
  const handleClose = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="printdata">
        {movie && (
          <div className="header">
            <div className="details">
              <h1 className="movietitle">
                {movie.Title ? movie.Title : "Movies"}
              </h1>
              <h4 className="Genre_book">{movie.Genre}</h4>
              <h4 className="rating_book">{movie.Rated}</h4>
            </div>
            <X className="close-icon" onClick={() => handleClose()} />
          </div>
        )}
        <div className="content">
          <h2 className="text1">Movie Avaiable in </h2>
          {Object.entries(theaterData).map(([theaterName, movieDetails]) => (
            <div
              key={theaterName}
              className="movies"
            >
              <h2 className="theatername">{theaterName.toUpperCase()}</h2>
              <div className="alldata">
              {Object.entries(movieDetails).map(([index, alldata]) => (
                <div key={index} className="moviedata">
                  <div className="show"
                   onClick={() => gotoBooking(theaterName, alldata)}
                   onMouseEnter={() => setHoveredShow({ theaterName, index })}
                   onMouseLeave={() => setHoveredShow({ theaterName: null, index: null })}
                 >{alldata.time}</div>
                   <div className={hoveredShow.theaterName === theaterName && hoveredShow.index === index ? 'hoverandshow1' : 'hoverandshow'}>
                    <h3 className="datashow">Available Seats - {alldata.tickets}</h3>
                    <h3 className="datashow">Ticket Price - {alldata.ticketPrice}</h3>
                  </div>
                </div>
              ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
