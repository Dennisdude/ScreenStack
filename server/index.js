const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get('/', (req, res) => {
  res.send('Willkommen zum Express-Server!');
});

app.get('/db-check', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
        status: 'success',
        message: 'Datenbankverbindung steht!',
        timestamp: result.rows[0].now
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Verbindung fehlgeschlagen' })
  }
});

app.post('/movies', async (req, res) => {
  try {
    const { tmdb_id, title, poster_path, media_type = 'movie' } = req.body;
    
    if (!tmdb_id || !title) {
      return res.status(400).json({ status: 'error', message: 'tmdb_id und title sind erforderlich' });
    }
    const query = `
      INSERT INTO movies (tmdb_id, title, poster_path, media_type)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const newMovie = await pool.query(query, [tmdb_id, title, poster_path, media_type]);

    res.json(newMovie.rows[0]);
  } catch (err) {
    console.error(err.message);

    if (err.code === '23505') {
      return res.status(409).json({ error: 'Film ist schon in der Liste!'});
    }
    res.status(500).send('Server fehler');
  }
});

app.get('/movies', async (req, res) => {
  try {
    const allMovies = await pool.query('SELECT * FROM movies ORDER BY created_at DESC');
    
    res.json(allMovies.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Fehler');
  }
});

app.delete('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params; // Die ID kommt aus der URL (z.B. /movies/5)
    
    const deleteMovie = await pool.query('DELETE FROM movies WHERE id = $1', [id]);
    
    // Check how many lines where deleted
    if (deleteMovie.rowCount === 0) {
      return res.status(404).json({ message: 'Film nicht gefunden oder existiert nicht.' });
    }
    
    res.json({ message: 'Film wurde gelöscht!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Fehler');
  }
});

// TMDb API
app.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const apiKey = process.env.TMDB_API_KEY;

    if (!query) {
      return res.status(400).json({ error: 'Suchbegriff fehlt' });
    }
    
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    res.json(data.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler bei der Kommunikation mit TMDb' });
  }
});

app.get('/trending', async (req, res) => {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler bei TMDb Trending' });
  }
});

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});