import React, { useState, useEffect } from "react";
import TheaterContext from "./theaterContext";

const TheaterContextProvider = ({ children }) => {
  const [theaterDatamain, setTheaterdatamain] = useState(() => {
    const savedData = localStorage.getItem("theaterDatamain");
    return savedData ? JSON.parse(savedData) : null;
  });

  const [billingData, setBillingData] = useState(() => {
    const savedBillingData = localStorage.getItem("billingData");
    return savedBillingData ? JSON.parse(savedBillingData) : {};
  });

  useEffect(() => {
    if (theaterDatamain !== null) {
      localStorage.setItem("theaterDatamain", JSON.stringify(theaterDatamain));
    }
  }, [theaterDatamain]);

  useEffect(() => {
    localStorage.setItem("billingData", JSON.stringify(billingData));
  }, [billingData]);

  return (
    <TheaterContext.Provider value={{ theaterDatamain, setTheaterdatamain, billingData, setBillingData }}>
      {children}
    </TheaterContext.Provider>
  );
};

export default TheaterContextProvider;
