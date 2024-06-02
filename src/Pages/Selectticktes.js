import React, { useContext, useEffect, useState } from "react";
import theaterContext from "../api/theaterContext.js";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, IndianRupee, X } from "lucide-react";
import { movies } from "../movies.js";
import "../Style/Selectticktes.css";
import {firestore , auth} from '../api/fiebase.config.js';
import {collection, getDocs, query, where } from "firebase/firestore";

export default function Selectticktes() {
  const params = useParams();
  const [movie, setMovie] = useState(null);
  const [Noofseats, setseats] = useState(1);
  const navigate = useNavigate();
  const { theaterDatamain ,billingData, setBillingData} = useContext(theaterContext);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movieData, setMoviedata] = useState(null);
  const [ticketsbookedData,setticketsbookedData] =  useState([]);
  const [user,setUser] = useState(null);
  const [isPayment,setIspayment] = useState(false);

  useEffect(() => {
    const foundMovie = movies.find((movie) => movie.imdbID === params.movieId);
    setMovie(foundMovie);
  }, [params.movieId]);

  useEffect(() => {
    if (theaterDatamain) {
      const firstKey = Object.keys(theaterDatamain)[0];
      setMoviedata(theaterDatamain[firstKey]);
      document.title = isPayment ? "Payment Summary - Movies" : `${firstKey} - ${theaterDatamain[firstKey]?.time} - Select Seats `
    }
  }, [theaterDatamain]);

  const fetchDataByMovieAndCinema = async (movieId, cinemaName) => {
    try {
        const theaterRef = collection(firestore, `bookedtickets/${movieId}/${cinemaName}`);
        const q = query(theaterRef);
        const querySnapshot = await getDocs(q);
        const ticketsData = [];
        querySnapshot.forEach(doc => {
            const data = doc.data();
            if (movieData && data.time === movieData.time) {
                ticketsData.push(data.selectedSeats); 
            }
        });
        setticketsbookedData(ticketsData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

useEffect(() => {
  console.log(movieData);
  if(movieData.tickets){
    fetchDataByMovieAndCinema(params.movieId, Object.keys(theaterDatamain));
    movieData.tickets += ticketsbookedData.length;
    console.log(movieData);
  }
  
}, [movieData]);

  const handleClose = () => {
    navigate(-1);
  };

  const generateSeatLabels = (totalSeats) => {
    const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const seatsPerRow = 9;
    let seatLabels = [];

    for (let i = 0; i < totalSeats; i++) {
      const row = rows[Math.floor(i / seatsPerRow)];
      const seatNumber = (i % seatsPerRow) + 1;
      seatLabels.push(`${row}${seatNumber}`);
    }

    return seatLabels;
  };

  const handleSeatClick = (seatLabel) => {
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatLabel)) {
        return prevSelectedSeats.filter((seat) => seat !== seatLabel);
      } else {
        if (prevSelectedSeats.length < Noofseats) {
          return [...prevSelectedSeats, seatLabel];
        }
        return prevSelectedSeats;
      }
    });
  };

  const getSeatClass = (seatLabel) => {
    if (selectedSeats.includes(seatLabel)) {
      return 'selected';
    }

    if (ticketsbookedData.includes(seatLabel)){
      return 'disabled';
    }
    return 'seat';
  };
  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
     if(user){
       setUser(user);
     }
    })
   },[]);

  const gotoPayment = () =>{
    if(selectedSeats.length === 0){
      alert("Please Select Seats")
    }
    else if(!user){
      alert("You are not logged in");
    }
    else{
      setIspayment(true);
    }
  };

  const gotofinalPayment = () =>{
    if (!theaterDatamain) {
      console.error("Theater data isn't available.");
      return;
    }
    
    if (!user) {
      const confirmed = window.confirm("You are not logged in! \nWould you like to go to the login page? (You will have to do all processes again)");
    
      if (confirmed) {
        navigate('/login');
      }else{
        return ;
      }
    }
    
    const cinemaNames = Object.keys(theaterDatamain);
    const totalAmount = selectedSeats.length * (movieData?.ticketPrice || 0) * 1.18;
    const time = movieData?.time

    setBillingData({
      movieId : params?.movieId,
      selectedSeats : selectedSeats,
      cinemaName : cinemaNames,
      totalAmount : totalAmount,
      time : time
    });
    console.log(billingData);
    navigate(`/proceedtopay/${params.movieId}`);
  }

  if(ticketsbookedData.length === 0){
    console.log(ticketsbookedData);
    return(
      <div>data isn't Loading</div>
    );
  }

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
          <X className="close-icon" onClick={handleClose} />
        </div>
      )}
      {theaterDatamain && !isPayment && (
        <div className="data">
          <h2 className="theatername_select">{Object.keys(theaterDatamain)}</h2>
          <div className="selectseats">
            <h3 className="text">Available Seats ({movieData?.tickets})</h3>
            <div className="choseseats">
              <h4>How Many Seats</h4>
              <select value={Noofseats} onChange={(e) => setseats(e.target.value)}>
                {[...Array(15).keys()].map((value) => (
                  <option key={value} value={value + 1}>
                    {value + 1} Seats
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="seats">
            {movieData &&
              generateSeatLabels(movieData.tickets).map((label, index) => (
                <div
                  key={index}
                  className={getSeatClass(label)}
                  onClick={() => handleSeatClick(label)}
                >
                  {label}
                </div>
              ))}
          </div>
          <div className="screen">Screen This Side</div>
          <div className="button">
          <h3 className="totalprice">Total price : <IndianRupee size={17}/>{selectedSeats.length * movieData?.ticketPrice} </h3>
          <button className="continue" onClick={()=>{gotoPayment()}}>Continue <ArrowRight style={{marginLeft:'10px',transition:'none'}}/></button>
          </div>
        </div>
      )}
      {isPayment && 
      <div className="data">
        <h1 className="summary">Booking Summary</h1>
        <div className="paymentsummary">
        <h2 className="seatesandtheater">{Object.keys(theaterDatamain)} - {selectedSeats.join(', ')} ({selectedSeats.length} Ticktes)</h2>
        <h3 className="totalpayment">Rs. {(selectedSeats.length * movieData?.ticketPrice).toFixed(2)}</h3>
        </div>
        <div className="paymentsummary" style={{borderBottom:'1px dotted rgb(113, 113, 113)'}}>
        <h2 className="seatesandtheater"> Convenience fees (18% GST)</h2>
        <h3 className="totalpayment">Rs.  {((selectedSeats.length * movieData?.ticketPrice) * 0.18).toFixed(2)}</h3>
        </div>

        <div className="paymentsummary">
        <h2 className="seatesandtheater">Sub Total (Inc. All Tax)</h2>
        <h3 className="totalpayment">Rs. {((selectedSeats.length * movieData?.ticketPrice) * 1.18).toFixed(2)}</h3>
        </div>

        <div className="payableamount">
        <h2 className="payableamounttext">Amount Payable</h2>
        <h3 className="payableamountmoney">Rs. {((selectedSeats.length * movieData?.ticketPrice) * 1.18).toFixed(2)}</h3>
        </div>

        <div className="continuebutton">
        <button className="backbutton" onClick={()=>setIspayment(false)}>Back to Seat Selection</button>
        <button className="continue" onClick={()=>gotofinalPayment()}>Proceed to Payment</button>
        </div>
      </div>
      }
    </div>
  );
}
