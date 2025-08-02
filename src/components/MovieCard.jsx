import React from "react";
import star from "../assets/Rating.svg";
import poster from "../assets/No-Poster.png";
import { useMovieContext } from "../contexts/MovieContext";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovieContext();

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // prevent bubbling
    e.preventDefault(); // prevent navigation
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <div className="movie-card group bg-[#12121e]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-md hover:shadow-purple-500/20 transition-shadow duration-300 p-4 text-white transform hover:scale-105 transition-transform duration-300 relative">
      {/* Favorite Button */}
      <button
        className={`absolute top-3 right-3 z-10 px-3 py-1 h-8 rounded-full text-xs font-semibold transition-opacity duration-300
          ${isFavorite(movie.id) ? "bg-pink-600 text-white" : "bg-white/50 text-pink-50"}
          opacity-0 group-hover:opacity-100`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite(movie.id) ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite(movie.id) ? "❤️" : "🤍"}
      </button>

      {/* Only clickable parts go in Link */}
      <Link to={`/movie/${movie.id || movie.$id}`} className="block">
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : poster}
          alt={movie.title || "No Poster Available"}
          className="w-full h-auto rounded-lg mb-4"
        />
        <h3 className="content text-lg font-bold mt-4">{movie.title || "Unknown Title"}</h3>
        <div className="content flex items-center text-sm mt-2">
          <div className="rating flex items-center">
            <img src={star} alt="star Icon" className="w-4 h-4 mr-1" />
            <p>{movie.vote_average?.toFixed(1) || "N/A"}</p>
          </div>
          <span className="mx-2">.</span>
          <p>{movie.original_language?.toUpperCase() || "N/A"}</p>
          <span className="mx-2">.</span>
          <p>{movie.release_date?.split("-")[0] || "N/A"}</p>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
