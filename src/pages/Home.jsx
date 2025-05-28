import React, { useEffect, useState } from 'react';
import '../index.css';
import '../App.css';
import Search from '../components/search.jsx';
import bgimg from '../assets/BG.png';
import heroimg from '../assets/hero-img.png';
import Spinner from '../spinner.jsx';
import MovieCard from '../components/MovieCard';
import './Home.css';
import { useDebounce } from 'use-debounce';
import { databases, DATABASE_ID, APPWRITE_COLLECTION_ID } from '../appwrite.js';
import { Query } from 'appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm] = useDebounce(searchTerm, 600);
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Fetch movies from TMDB
  const fetchMovies = async (query = '') => {
    setErrorMessage('');
    setIsLoading(true);

    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const endpoint = query
      ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&api_key=${apiKey}`
      : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${apiKey}`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };

    try {
      const response = await fetch(endpoint, options);

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      setMovies(data.results || []);

      // Update search count in Appwrite if a query and results exist
      if (query && data.results.length > 0) {
        await updateSearchCount(query, loadTrendingMovies);
      }
    } catch (error) {
      setErrorMessage(`Failed to fetch movies: ${error.message}`);
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load trending movies from Appwrite
  const loadTrendingMovies = async () => {
    setIsLoading(true);
    try {
      const results = await databases.listDocuments(DATABASE_ID, APPWRITE_COLLECTION_ID);
      const sortedMovies = results.documents
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      setTrendingMovies(sortedMovies);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debounceSearchTerm && debounceSearchTerm.trim() !== '') {
      fetchMovies(debounceSearchTerm);
    } else {
      fetchMovies();
    }
    // eslint-disable-next-line
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
    // eslint-disable-next-line
  }, []);

  return (
    <main className="bg-cover bg-center min-h-screen" style={{ backgroundImage: `url(${bgimg})` }}>
      <div className="pattern" />
      <div className="wrapper">
        {/* Header Section */}
        <header className="text-white text-center py-10">
          <img src={heroimg} alt="hero" className="banner mx-auto" />
          <h1 className="text-4xl font-bold">
            Find{' '}
            <span className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Movies
            </span>{' '}
            You'll Enjoy <br /> Without any Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {/* Trending Movies Section */}
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2 className="text-white text-3xl font-bold text-center mt-10 mb-6">Trending Movies</h2>
            {isLoading ? (
              <Spinner />
            ) : (
              <ul className="flex flex-row overflow-y-auto gap-5 -mt-10 w-full hide-scrollbar">
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id} className="min-w-[230px] flex flex-row items-center">
                    <p className="fancy-text mt-[22px] text-nowrap">{index + 1}</p>
                    <img
                      src={movie.poster_url}
                      alt="Trending Movie Poster"
                      className="w-[127px] h-[163px] rounded-lg object-cover -ml-3.5"
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* All Movies Section */}
        <section className="all-movies">
          <h2 className="text-white text-3xl font-bold text-center mt-10">All Movies</h2>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          {isLoading ? (
            <Spinner />
          ) : (
            <ul className="movies-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {movies.map((movie) => (
                <li key={movie.id}>
                  <MovieCard movie={movie} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default Home;

// Helper: Update search count in Appwrite
export const updateSearchCount = async (searchTerm, loadTrendingMovies) => {
  try {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    const results = await databases.listDocuments(DATABASE_ID, APPWRITE_COLLECTION_ID, [
      Query.equal('searchTerm', lowerCaseSearchTerm),
    ]);

    if (results.documents.length > 0) {
      const documentId = results.documents[0].$id;
      const currentCount = results.documents[0].count || 0;

      await databases.updateDocument(DATABASE_ID, APPWRITE_COLLECTION_ID, documentId, {
        searchTerm: lowerCaseSearchTerm,
        count: currentCount + 1,
        poster_url: results.documents[0].poster_url,
      });
    } else {
      const movieDetails = await fetchMovieDetails(searchTerm);

      if (!movieDetails.poster_path || !movieDetails.id || !movieDetails.title) {
        throw new Error('Movie details are incomplete');
      }

      await databases.createDocument(DATABASE_ID, APPWRITE_COLLECTION_ID, 'unique()', {
        searchTerm: lowerCaseSearchTerm,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
        movie_id: movieDetails.id,
        title: movieDetails.title,
      });
    }

    await loadTrendingMovies();
  } catch (error) {
    console.error('Error updating search count:', error);
  }
};

// Helper: Fetch movie details from TMDB
const fetchMovieDetails = async (searchTerm) => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(searchTerm)}&api_key=${apiKey}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  };

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    throw new Error(`Failed to fetch movie details: ${response.status}`);
  }

  const data = await response.json();
  if (data.results.length > 0) {
    return data.results[0];
  }

  throw new Error('No movie details found for the given search term');
};

