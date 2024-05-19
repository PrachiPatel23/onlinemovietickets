import React, { useContext, useEffect, useState } from "react";
import theaterContext from "../api/theaterContext.js";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { movies } from "../movies.js";
import "../Style/Selectticktes.css";
export default function Selectticktes() {
  const params = useParams();
  const [movie, setMovie] = useState(null);
  const [Noofseats, setseats] = useState(1);
  const navigate = useNavigate();
  const { theaterDatamain, setTheaterdatamain } = useContext(theaterContext);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movieData, setMoviedata] = useState(null);
  useEffect(() => {
    const foundMovie = movies.find((movie) => movie.imdbID === params.movieId);
    setMovie(foundMovie);
  }, [params.movieId]);

  useEffect(() => {
    if (theaterDatamain) {
      const firstKey = Object.keys(theaterDatamain)[0];
      setMoviedata(theaterDatamain[firstKey]);
    }
  }, [theaterDatamain]);

  const handleClose = () => {
    navigate(-1);
  };


  const getSeatLabel = (index) => {
    const row = String.fromCharCode(65 + Math.floor(index / 9));
    const seatNumber = (index % 9) + 1;
    return `${row}${seatNumber}`;
  };

  const toggleSeatSelection = (label) => {
    if (selectedSeats.includes(label)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== label));
    } else {
      if (selectedSeats.length < Noofseats) {
        setSelectedSeats([...selectedSeats, label]);
      } else {
        console.log("MAx limit");
      }
    }
  };
  

  return (
    <div className="selectseat">
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
      {theaterDatamain && (
        <div className="data">
          <h2 className="theatername_select">{Object.keys(theaterDatamain)}</h2>
          <div className="selectseats">
            <h3 className="text">Aviable Seats</h3>
            <div className="choseseats">
              <h4>How Many Seats</h4>
              <select value={Noofseats} onChange={(e)=>setseats(e.target.value)}>
                {[...Array(15).keys()].map((value) => (
                  <option key={value} value={value + 1}>
                    {value + 1} Seats
                  </option>
                ))}
              </select>
            </div>
              <button className="continue">Continue</button>
          </div>
          <div className="seats">
            {movieData && Array.from({ length: movieData.avaiableSeat }, (_, index) => {
              const label = getSeatLabel(index);
              const isSelected = selectedSeats.includes(label);
              return (
                <h3
                  key={index}
                  className={isSelected ? "selected" : "notselected"}
                  onClick={() => toggleSeatSelection(label)}
                >
                  {label}
                </h3>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
