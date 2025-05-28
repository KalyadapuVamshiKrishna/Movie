import React, { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
  try {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Failed to load favorites", err);
    return [];
  }
});


  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavs = localStorage.getItem("favorites");
    if (storedFavs) setFavorites(JSON.parse(storedFavs));
  }, []);

  // Save favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (movie) => {
    // Normalize the movie object to always have an 'id' property
    const normalizedMovie = {
      ...movie,
      id: movie.id ?? movie.$id,
    };
    setFavorites((prev) => {
      if (prev.some((m) => m.id === normalizedMovie.id)) return prev;
      return [...prev, normalizedMovie];
    });
  };

  const removeFromFavorites = (movieId) => {
    setFavorites((prev) =>
      prev.filter((movie) => (movie.id || movie.$id) !== movieId)
    );
  };

  const isFavorite = (movieId) => {
    return favorites.some((movie) => (movie.id || movie.$id) === movieId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};