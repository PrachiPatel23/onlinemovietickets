import React from 'react';
import { movies } from '../movies.js'; // Assuming your movies data is here
import '../Style/Suggestion.css';
import { Star } from 'lucide-react'; // Proxy for development only (consider alternatives for production)
import { useNavigate } from 'react-router-dom';

const placeholderImageUrl = 'https://via.placeholder.com/150x200'; // Placeholder image URL (replace with your preference)

export default function Suggestion() {
  const navigate = useNavigate();
  const filteredMovies = movies.filter(
    movie => ['Avatar', 'The Avengers', 'Interstellar', 'Gotham'].includes(movie.Title)
  );
  const filteredComingSoonMovies = movies.filter(movie => movie.ComingSoon);
  const gotoMovies = (movieId) =>{
      navigate(`/movies/${movieId}`);
  }
  return (
    <div className='maindiv' >
      <h2 className='moviesText'>Recommended Movies</h2>
      <ul className='suggestionUL'>
        {filteredMovies.map((movie, index) => (
          <li key={index} className='suggestionsli' onClick={()=>gotoMovies(movie.imdbID)}>
            <img
              src={movie.Poster}
              alt={movie.Title}
              className='poster'
              onError={(event) => {
                event.target.src = placeholderImageUrl; 
              }}
            />
            <h2 className='movieheader'>{movie.Title}</h2>
            <p className='genre'>{movie.Genre}</p>
            <p className='imdbrating'>
              {movie.imdbRating} <Star style={{ marginLeft: '5px', fill: "#FFC53D", color: "transparent" }} />
            </p>
            <p className='genre'>{movie.imdbID}</p>
          </li>
        ))}
      </ul>

      <h2 className='moviesText'>Comming Soon</h2>
      <ul className='suggestionUL'>
        {filteredComingSoonMovies.map((movie, index) => (
          <li key={index} className='suggestionsli' onClick={()=>gotoMovies(movie.imdbID)}>
            <img
              src={movie.Poster}
              alt={movie.Title}
              className='poster'
              onError={(event) => {
                event.target.src = placeholderImageUrl; 
              }}
            />
            <h2 className='movieheader'>{movie.Title}</h2>
            <p className='genre'>{movie.Genre}</p>
            <p className='imdbrating'>
              {movie.imdbRating} <Star style={{ marginLeft: '5px', fill: "#FFC53D", color: "transparent" }} />
            </p>
            <p className='genre'>{movie.imdbID}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
