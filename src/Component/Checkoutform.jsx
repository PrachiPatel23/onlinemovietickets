import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useEffect, useState } from 'react'
import '../Style/Checkoutform.css';
import { MoveLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth , firestore} from '../api/fiebase.config';
import { doc, setDoc, collection, getDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
export default function Checkoutform(props) {
    const billingData = props.billingData;
    const stripe = useStripe()
    const [randomId , setrandomId] = useState('null');
    const elements = useElements();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!stripe){
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if(!clientSecret){
            return ; 
        }
        
        stripe.retrievePaymentIntent(clientSecret).then(({paymentIntent})=>{
            switch(paymentIntent.status){
                case "succeeded":
                    console.log("Payment is Complete");
                    break;
                case "processing":
                    console.log("Payment in Processing");
                    break;
                case "requires_payment_method":
                    console.log("Your Payment is not Successfull");
                    break;
                default:
                    console.log("Something went wrong ... !")
                    break;
            }
        });

    },[stripe])

    const updateTheaterdata = async () => {
        try {
            const theaterRef = doc(firestore, `theater/${billingData.movieId}`);
            const theaterSnapshot = await getDoc(theaterRef);
            const theaterData = theaterSnapshot.data();
    
            if (!theaterData) {
                throw new Error('Theater data not found');
            }
            const cinemaName = billingData.cinemaName;
            const cinemaData = theaterData[cinemaName];
    
            if (!cinemaData) {
                throw new Error('Cinema data not found');
            }
            const showtime = cinemaData.find(show => show.time === billingData.time);
    
            if (!showtime) {
                throw new Error('Showtime not found');
            }
            const updatedTickets = showtime.tickets - billingData.selectedSeats.length;
            showtime.tickets = updatedTickets;
            await setDoc(theaterRef, theaterData);
    
            console.log('Theater data updated successfully');
        } catch (error) {
            console.error('Error updating theater data: ', error);
            alert('Error updating theater data: ' + error.message);
        }
    };
    

    const insertIntoDatabase = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('User not authenticated');
            }
    
            const todayDate = new Date().toISOString().split('T')[0]; 
            const rand_Id = doc(collection(firestore, 'dummyCollection')).id; 
            setrandomId(rand_Id);
            const bookingData = {
                ticketsId : randomId,
                bookedBy: user.email,
                time: billingData.time,
                ticketsCounts: billingData.selectedSeats.length,
                totalAmount: billingData.totalAmount,
                date: todayDate,
                selectedSeats: billingData.selectedSeats
            };
            const docRef = doc(firestore, `bookedtickets/${billingData.movieId}/${billingData.cinemaName}/${rand_Id}`);
            await setDoc(docRef, bookingData);
    
            generatePdf();
            updateTheaterdata();
        } catch (error) {
            console.error('Error writing document: ', error);
            alert('Error writing document: ' + error.message);
        }
    };
    const generatePdf = () => {
        const doc = new jsPDF();
        doc.setProperties({
          title: `${billingData.cinemaName} - ${billingData.selectedSeats} Tickets Booked Bill `,
          author: 'Movies',
          subject: 'Movie Ticket Bill',
        });
        const { cinemaName, time, selectedSeats, totalAmount } = billingData;
        const user = `${auth.currentUser.email}`; 
        const leftMargin = 10;
        const topMargin = 20;
        const lineHeight = 10;
        const contentWidth = 100;
        const horizontalLineY = topMargin + lineHeight * 3;
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#6E56CF');
        doc.text('Movies', leftMargin, topMargin);
      
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor('#000000'); 
        doc.text(`Consumer Email: ${user}`, leftMargin, topMargin + lineHeight);
        doc.text(`Timing: ${time}`, leftMargin, topMargin + lineHeight + 10);
        doc.text(`Tickets ID: ${randomId}`, leftMargin, topMargin + lineHeight + 20);
        doc.setLineWidth(0.1);
        doc.line(leftMargin, horizontalLineY + 5 , doc.internal.pageSize.width - leftMargin, horizontalLineY + 5);
        doc.text(`${cinemaName} - ${selectedSeats.join(', ')} - ${time}`, leftMargin, horizontalLineY + lineHeight);
        doc.text(`Rs. ${totalAmount}.00`, doc.internal.pageSize.width - leftMargin - contentWidth, horizontalLineY + lineHeight);
        doc.line(leftMargin, horizontalLineY + lineHeight * 2 + 5, doc.internal.pageSize.width - leftMargin, horizontalLineY + 5+ lineHeight * 2 );
        doc.text('Sub Amount', leftMargin, horizontalLineY + lineHeight * 3);
        doc.text(`Rs. ${totalAmount}.00`, doc.internal.pageSize.width - leftMargin - contentWidth, horizontalLineY + lineHeight * 3);
        doc.save(`${cinemaName}_${selectedSeats.join('_')}_movie_ticket_bill.pdf`);
      };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!stripe || !elements) {
            return;
        }
    
        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                },
                redirect: 'if_required' 
            });
    
            if (error) {
                if (error.type === "card_error" || error.type === "validation_error") {
                    console.log(error.message);
                } else {
                    console.log(error.message);
                }
            } else {
                if (paymentIntent && paymentIntent.status === 'succeeded') {
                    insertIntoDatabase();
                    navigate('/');
                } else {
                    console.log('Payment confirmation status:', paymentIntent.status);
                    alert('Payment processing. Please wait.');
                }
            }
        } catch (error) {
            console.error('Error during payment confirmation:', error);
            alert('Payment failed. Please try again.');
        }
    };
    
    const handleEmailChange = (e) =>{
        //console.log(e);
    }

    const paymentElementOptions = {
        layout:"accordion"
    };

    const gotoback = () =>{
        navigate(-1);
    }
  return (
    <div className="mainPayment">
    <div className="amounttext">
        <MoveLeft className='arrow'onClick={()=>gotoback()}/>
        <h1>Payment Summary</h1>
        <h3 className="cinamaname">
            {billingData.cinemaName} ({billingData.time}) - {billingData.selectedSeats.join(', ')} 
        </h3>
        <h3 className="totalamount">
        Payable Amount - Rs. {billingData.totalAmount}.00
        </h3>
        <h3 className="movieId">
        Movie Id - {billingData.movieId}
        </h3>
    </div>
   <form id='payment-form' onSubmit={handleSubmit} className='formofpayment'>
    <h1>Movies</h1>
    <LinkAuthenticationElement
    id='link-authentication-element'
    onChange={handleEmailChange}
    />
    <PaymentElement id='payment-element' options={paymentElementOptions}/>
    <button id='submit' className='paynow'>Pay Now</button>
   </form>
   </div>
  )
}
