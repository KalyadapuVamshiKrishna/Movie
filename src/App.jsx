import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import './App.css';
import Favorites from './pages/Favorites';
import MovieDetails from './pages/MovieDetails';



function App() {
  return(
    <div>
      <Navbar />
    <main className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        
      </Routes>
    </main>
    </div>

  )
}

export default App;