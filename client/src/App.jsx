import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  
  // 1. NEUER STATE für das Formular
  const [title, setTitle] = useState('');
  const [tmdbId, setTmdbId] = useState('');
  const [posterPath, setPosterPath] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:5000/movies');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Fehler beim Laden:", error);
    }
  };

  // 2. NEUE FUNKTION: Film hinzufügen
  const handleSubmit = async (e) => {
    e.preventDefault(); // Verhindert, dass die Seite neu lädt

    try {
      const response = await fetch('http://localhost:5000/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Wir schicken die Daten als JSON-String an das Backend
        body: JSON.stringify({ 
          title: title, 
          tmdb_id: tmdbId,
          poster_path: posterPath 
        }),
      });

      if (response.ok) {
        // Wenn erfolgreich: Formular leeren und Liste neu laden
        setTitle('');
        setTmdbId('');
        setPosterPath('');
        fetchMovies(); 
        alert('Film hinzugefügt! 🍿');
      } else {
        const errorData = await response.json();
        alert('Fehler: ' + errorData.error);
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    }
  };

  // Funktion zum Löschen (Bonus)
  const deleteMovie = async (id) => {
    if(!confirm("Wirklich löschen?")) return;
    
    try {
      await fetch(`http://localhost:5000/movies/${id}`, { method: 'DELETE' });
      fetchMovies(); // Liste aktualisieren
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  }

  return (
    <div className="app-container">
      <h1>ScreenStack Watchlist 🎬</h1>

      {/* 3. DAS FORMULAR */}
      <div className="card add-movie-form">
        <h2>Neuen Film hinzufügen</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Filmtitel (z.B. Inception)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="TMDb ID (z.B. 27205)"
              value={tmdbId}
              onChange={(e) => setTmdbId(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Poster URL (optional)"
              value={posterPath}
              onChange={(e) => setPosterPath(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary">Speichern</button>
        </form>
      </div>

      <hr />

      <div className="movie-list">
        <h2>Meine Liste</h2>
        {movies.length === 0 ? (
          <p>Noch keine Filme. Füge oben einen hinzu!</p>
        ) : (
          <ul className="movie-grid">
            {movies.map((movie) => (
              <li key={movie.id} className="movie-card">
                <strong>{movie.title}</strong> (ID: {movie.tmdb_id})
                <br />
                <button 
                  onClick={() => deleteMovie(movie.id)}
                  style={{background: 'red', color: 'white', border: 'none', marginTop: '5px', cursor: 'pointer'}}
                >
                  Löschen
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;