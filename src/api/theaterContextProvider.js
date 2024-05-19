import React, { useState, useEffect } from "react";
import TheaterContext from "./theaterContext";

const TheaterContextProvider = ({ children }) => {
  const [theaterDatamain, setTheaterdatamain] = useState(() => {
    const savedData = localStorage.getItem("theaterDatamain");
    return savedData ? JSON.parse(savedData) : null;
  });

  useEffect(() => {
    if (theaterDatamain !== null) {
      localStorage.setItem("theaterDatamain", JSON.stringify(theaterDatamain));
    }
  }, [theaterDatamain]);

  return (
    <TheaterContext.Provider value={{ theaterDatamain, setTheaterdatamain }}>
      {children}
    </TheaterContext.Provider>
  );
};

export default TheaterContextProvider;
