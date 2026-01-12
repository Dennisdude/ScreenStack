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

app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});