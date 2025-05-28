import React from "react";
import "../Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

function Favorites() {
  const { favorites } = useMovieContext();

  return (
    <main className="favorites-main">
      <div className="favorites-wrapper">
        
        <header className="favorites-header">
          <h1>Your Favorites</h1>
        </header>
        {favorites && favorites.length > 0 ? (
          <section className="favorites-section">
            <div className="movies-list">
              {favorites.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))}
            </div>
          </section>
        ) : (
          <section className="favorites-empty">
            <h2>No Favorite Movies Yet</h2>
            <p>Start adding movies to your favorites and they will appear here!</p>
          </section>
        )}
      </div>
    </main>
  );
}

export default Favorites;