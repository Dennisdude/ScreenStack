import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await fetch('http://localhost:5000/movies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Fehler beim Laden:", error);
    }
  };

  const searchMovies = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      const response = await fetch(`http://localhost:5000/search?query=${searchQuery}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Fehler bei der Suche:", error);
    }
  };

  const addMovie = async (movieFromTmdb) => {
    try {
      const response = await fetch('http://localhost:5000/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: movieFromTmdb.title, 
          tmdb_id: movieFromTmdb.id,
          poster_path: movieFromTmdb.poster_path 
        }),
      });

      if (response.ok) {
        setSearchResults([]);
        setSearchQuery('');
        fetchWatchlist();
      } else {
        const err = await response.json();
        alert(err.error || 'Fehler beim Speichern');
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen:", error);
    }
  };

  const deleteMovie = async (id) => {
    if(!confirm("Löschen?")) return;
    await fetch(`http://localhost:5000/movies/${id}`, { method: 'DELETE' });
    fetchWatchlist();
  }

  return (
    <div className="app-container">
      <div class="logo-container">
        <img src="src/assets/logo.svg" alt="ScreenStack Logo" class="logo-img" />
        <h1>ScreenStack</h1>
      </div>

      {/* Searchbar */}
      <div className="card">
        <h2>Film suchen</h2>
        <form onSubmit={searchMovies} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Titel suchen (z.B. Interstellar)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary">Suchen</button>
        </form>

        {/* Search results */}
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((result) => (
              <li key={result.id} className="search-item">
                {result.poster_path && (
                  <img 
                    src={`https://image.tmdb.org/t/p/w92${result.poster_path}`} 
                    alt={result.title} 
                  />
                )}
                <div>
                  <strong>{result.title}</strong> ({result.release_date?.substr(0, 4)})
                  <br />
                  <button 
                    onClick={() => addMovie(result)}
                    className="btn-add"
                  >
                    + Zur Watchlist
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr />

      {/* Watchlist */}
      <div className="movie-list">
        <h2>Meine Watchlist ({movies.length})</h2>
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              {movie.poster_path && (
                 <img 
                   src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`} 
                   alt={movie.title} 
                 />
              )}
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <button onClick={() => deleteMovie(movie.id)} className="btn-delete">Löschen</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;