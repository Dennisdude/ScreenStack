# ScreenStack

A modern movie watchlist application that allows users to search for movies using The Movie Database (TMDb) API and maintain their personal collection of films to watch.

## Features

- Search movies by title using TMDb API
- Add movies to your personal watchlist
- Remove movies from your watchlist
- PostgreSQL database for data persistence

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

## Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE screenstack;
```

2. Create the movies table:
```sql
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  tmdb_id INTEGER UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  poster_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. Create a `.env` file in the `server` directory with your database credentials:
```env
DB_USER=your_db_user
DB_HOST=localhost
DB_DATABASE=screenstack_db
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
TMDB_API_KEY=your_tmdb_api_key
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

The backend provides the following endpoints:

- `GET /` - Welcome message
- `GET /db-check` - Check database connection
- `GET /movies` - Get all movies in watchlist
- `POST /movies` - Add a new movie to watchlist
- `DELETE /movies/:id` - Remove a movie from watchlist
- `GET /search?query=<search_term>` - Search movies via TMDb API

## Development

### Available Scripts

#### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production

#### Server
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
