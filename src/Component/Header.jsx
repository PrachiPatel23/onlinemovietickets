import { SearchIcon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import "../Style/Header.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth} from "../api/fiebase.config";

export default function Header({ email }) {
  const [searchBar, setsearchbar] = useState("");
  const [email1, setEmail] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (email) {
      setEmail(email);
    }
  }, [email]);

  const navigateLogin = () => {
    navigate("/login");
  };

  const showProfile1 = () => {
    setShowProfile(!showProfile);
  };

  const logOutfunciton = async () => {
    await signOut(auth)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <header className="appHeader">
      <div className="leftSection">
        <div className="leftContent">
          <div className="logo">Movies</div>
          <div className="buttons">
            <button className="button">Movies</button>
            <button className="button">Stream</button>
            <button className="button">Events</button>
            <button className="button">Sport</button>
          </div>
        </div>
      </div>
      <div className="rightSection">
        <div className="rightContent">
          <input
            type="text"
            value={searchBar}
            onChange={(e) => setsearchbar(e.target.value)}
            placeholder="Search for a movie"
            className="searchBar"
          />
          <SearchIcon className="searchIcon" />
        </div>
        {email1 !== null ? (
          <button className="loggedin" onClick={showProfile1}>
            {email1[0]}
          </button>
        ) : (
          <button className="loginButton" onClick={navigateLogin}>
            Login
          </button>
        )}
      </div>
      <div className={showProfile ? "user" : "userDis"}>
        <div className="main">
          <h3 className="emailaddress">{email1}</h3>
          <X onClick={showProfile1} style={{cursor:'pointer'}}/>
        </div>
        <div className="divider"></div>
        <h2 className="setting">Setting</h2>
        <h2 className="setting" id="logout" onClick={() => logOutfunciton()}>
          Logout
        </h2>
      </div>
    </header>
  );
}
