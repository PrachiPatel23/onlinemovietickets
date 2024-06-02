import { loadStripe } from '@stripe/stripe-js'
import React, { useEffect, useState ,useContext} from 'react'
import theaterContext from "../api/theaterContext.js";
import Checkoutform from '../Component/Checkoutform';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
    "pk_test_51PMrqyE02qQiZzANBlIGJnE43esxLFWzPSVd6MHg9wFHhzYiY9yVrbAGTDxfWbPd4UgjpLPE4BlJH33zgPjJlTt900Tirdqfs2"
);
export default function Payment() {
    const [clientSecret,setClientSecret] = useState("");
    const { theaterDatamain , billingData,setBillingData} = useContext(theaterContext);
    useEffect(() => {
        if (billingData.totalAmount) {
            fetch("http://localhost:3939/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticktesTotal: billingData.totalAmount })
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => setClientSecret(data.clientSecret))
            .catch(error => console.error("Error:", error));
        }
    }, [billingData.totalAmount]);

    const appearance = {
        theme : "stripe",
        variables:{
            fontFamily:"Helvetica"
        },
        rules:{
            '.Input':{
                outline:'none'
            },
            '.Input:focus': {
                boxShadow: 'none',
              },
              '.Label':{
                fontSize:'medium',
              }
        }
    }

    const options = {
        clientSecret,
        appearance
    }
  return (
    <div>
      {clientSecret && (
        <Elements
        options={options}
        stripe = {stripePromise}
        >
        <Checkoutform billingData = {billingData}/>
        </Elements>
      )}
    </div>
  )
}
