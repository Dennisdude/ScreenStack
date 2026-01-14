import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('');

  const fetchMovies = async () => {
    const res = await fetch('http://localhost:5000/movies');
    const data = await res.json();
    setMovies(data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (item) => {
    if (!confirm(`${item.title} wirklich löschen?`)) return;
    await fetch(`http://localhost:5000/movies/${item.id}`, { method: 'DELETE' });
    fetchMovies();
  };

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Meine Watchlist</h1>
        <input 
          type="text" 
          placeholder="In Watchlist suchen..." 
          className="border p-2 rounded shadow-sm w-64"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {filteredMovies.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-xl">Nichts gefunden.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map(movie => (
            <MovieCard 
              key={movie.id} 
              item={movie} 
              onAction={handleDelete} 
              actionLabel="Löschen" 
              isDestructive={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;