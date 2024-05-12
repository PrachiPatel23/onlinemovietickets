import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Showmovie from './Pages/Showmovie';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Signup" element={<Signup/>} />
        <Route path="/movies/:movieId" element={<Showmovie/>} />
      </Routes>
    </Router>
  );
}

export default App;
