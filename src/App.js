import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Showmovie from './Pages/Showmovie';
import Booktickets from './Pages/Booktickets';
import TheaterContextProvider from './api/theaterContextProvider';
import Selectticktes from './Pages/Selectticktes';

function App() {
  return (
    <TheaterContextProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Signup" element={<Signup/>} />
        <Route path="/movies/:movieId" element={<Showmovie/>} />
        <Route path="/bookmovie/:movieId" element={<Booktickets/>} />
        <Route path="/selectticktes/:movieId" element={<Selectticktes/>} />
      </Routes>
    </Router>
    </TheaterContextProvider>
  );
}

export default App;
