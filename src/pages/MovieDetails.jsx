import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../spinner.jsx';
import { useMovieContext } from '../contexts/MovieContext';
import './MovieDetails.css';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToFavorites, isFavorite, removeFromFavorites } = useMovieContext();

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        // Fetch movie details
        const response = await fetch(
          `${API_BASE_URL}/movie/${id}?api_key=${apiKey}&language=en-US`
        );
        if (!response.ok) throw new Error('Failed to fetch movie details');
        const data = await response.json();
        setMovie(data);

        // Fetch trailer
        const videoRes = await fetch(
          `${API_BASE_URL}/movie/${id}/videos?api_key=${apiKey}&language=en-US`
        );
        const videoData = await videoRes.json();
        const trailerVideo = videoData.results?.find(
          (vid) => vid.type === "Trailer" && vid.site === "YouTube"
        );
        setTrailer(trailerVideo ? `https://www.youtube.com/watch?v=${trailerVideo.key}` : null);
      } catch (err) {
        setMovie(null);
        setTrailer(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) return <Spinner />;
  if (!movie) return <main className="movie-details-main"><h2 className="text-center text-white">Movie not found.</h2></main>;

  // Format runtime
  const formatRuntime = (min) => {
    if (!min) return "N/A";
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h ${m}m`;
  };

  return (
   <main className="bg-black text-white min-h-screen px-4 py-8">
  <div className="max-w-6xl mx-auto">
    {/* Header: Movie Title & Tagline */}
    <header className="mb-8">
      <h1 className="text-4xl font-bold">{movie.title}</h1>
      <p className="italic text-purple-300 mt-1">{movie.tagline}</p>
    </header>

    {/* Details Section: Content + Poster */}
    <section className="flex flex-col lg:flex-row gap-10">
      
      {/* Left Side: Movie Info */}
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-semibold">{movie.title}</h2>
        <p><span className="font-bold text-purple-400">Overview:</span> {movie.overview || "No overview available."}</p>
        <p><span className="font-bold text-purple-400">Genres:</span> {movie.genres?.map(g => g.name).join(", ") || "N/A"}</p>
        <p><span className="font-bold text-purple-400">Rating:</span> {movie.vote_average ? `${movie.vote_average} / 10` : "N/A"}</p>
        <p><span className="font-bold text-purple-400">Release Date:</span> {movie.release_date || "N/A"}</p>
        <p><span className="font-bold text-purple-400">Duration:</span> {formatRuntime(movie.runtime)}</p>
        <p><span className="font-bold text-purple-400">Status:</span> {movie.status || "N/A"}</p>
        <p><span className="font-bold text-purple-400">Original Language:</span> {movie.original_language?.toUpperCase() || "N/A"}</p>
        <p><span className="font-bold text-purple-400">Countries:</span> {movie.production_countries?.map(c => c.name).join(", ") || "N/A"}</p>
        <p><span className="font-bold text-purple-400">Budget:</span> {movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"}</p>
        <p><span className="font-bold text-purple-400">Revenue:</span> {movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}</p>
        <p>
          <span className="font-bold text-purple-400">Production Companies:</span>{" "}
          {movie.production_companies?.map(c => c.name).join(", ") || "N/A"}
        </p>

        {trailer && (
          <p>
            <span className="font-bold text-purple-400">Trailer:</span>{" "}
            <a
              href={trailer}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline hover:text-pink-400 transition"
            >
              Watch on YouTube
            </a>
          </p>
        )}

        <button
          onClick={() =>
            isFavorite(movie.id)
              ? removeFromFavorites(movie.id)
              : addToFavorites(movie)
          }
          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4 py-2 mt-4 rounded-full font-semibold hover:scale-105 transition"
        >
          {isFavorite(movie.id) ? "Remove from Favorites" : "Add to Favorites"}
        </button>
      </div>

      {/* Right Side: Poster Image */}
      <div className="w-full max-w-sm mx-auto lg:mx-0">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Poster"
          }
          alt={movie.title}
          className="rounded-xl shadow-lg object-cover w-full h-auto"
        />
      </div>
    </section>
  </div>
</main>

  );
};

export default MovieDetails;