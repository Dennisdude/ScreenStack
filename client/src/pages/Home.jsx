import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/trending')
      .then(res => res.json())
      .then(data => setTrending(data))
      .catch(err => console.error(err));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    const res = await fetch(`http://localhost:5000/search?query=${query}`);
    const data = await res.json();
    setSearchResults(data);
  };

  const addToWatchlist = async (item) => {
    const date = item.release_date || item.first_air_date;

    const payload = {
      tmdb_id: item.id,
      title: item.title || item.name,
      poster_path: item.poster_path,
      media_type: item.media_type || 'movie',
      release_date: date
    };

    const res = await fetch('http://localhost:5000/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert(`${payload.title} hinzugefügt!`);
    } else {
      const err = await res.json();
      alert(`Fehler: ${err.error}`);
    }
  };

  const itemsToShow = searchResults.length > 0 ? searchResults : trending;
  const headline = searchResults.length > 0 ? `Suchergebnisse für "${query}"` : "Aktuell Beliebt (Trending)";

  return (
    <div className="container mx-auto p-4">
      {/* Searchbar Hero Section */}
      <div className="bg-slate-800 text-white p-8 rounded-xl mb-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Entdecke Filme & Serien</h1>
        <form onSubmit={handleSearch} className="flex max-w-lg mx-auto gap-2">
          <input 
            type="text" 
            className="flex-grow p-3 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Wonach suchst du heute?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 px-6 py-3 rounded font-bold hover:bg-blue-700 transition">
            Suchen
          </button>
        </form>
        {searchResults.length > 0 && (
          <button 
            onClick={() => { setSearchResults([]); setQuery(''); }} 
            className="text-sm text-gray-400 mt-2 hover:text-white underline"
          >
            Suche löschen / Zurück zu Trending
          </button>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">{headline}</h2>
      
      {/* Grid Layout Tailwind */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {itemsToShow.map(item => (
          <MovieCard 
            key={item.id} 
            item={item} 
            onAction={addToWatchlist} 
            actionLabel="+ Watchlist" 
          />
        ))}
      </div>
    </div>
  );
};

export default Home;