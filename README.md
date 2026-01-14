# ScreenStack

A movie and TV show watchlist application that allows users to discover trending content, search for movies and series using The Movie Database (TMDb) API, and maintain their personal collection of films and shows to watch.

## Features

- Search movies and TV shows by title using TMDb API
- Discover trending movies and TV series
- Add movies and TV shows to your personal watchlist
- Remove items from your watchlist
- Filter and search within your watchlist
- PostgreSQL database for data persistence

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS (for styling)
- React Router DOM (for navigation)

### Backend
- Node.js
- Express.js
- PostgreSQL
- TMDb API

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
  media_type VARCHAR(50) DEFAULT 'movie',
  release_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. Create a `.env` file in the `server` directory with your database credentials:
```env
DB_USER=your_db_user
DB_HOST=localhost
DB_DATABASE=screenstack
DB_PASSWORD=your_db_password
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

## Application Structure

The application consists of two main pages:

- **Home (Entdecken)**: Discover trending movies and TV shows, search for content, and add items to your watchlist
- **Watchlist (Meine Liste)**: View and manage your personal collection with filtering capabilities

## API Endpoints

The backend provides the following endpoints:

- `GET /` - Welcome message
- `GET /db-check` - Check database connection
- `GET /movies` - Get all movies and TV shows in watchlist
- `POST /movies` - Add a new movie or TV show to watchlist
- `DELETE /movies/:id` - Remove an item from watchlist
- `GET /search?query=<search_term>` - Search movies and TV shows via TMDb API
- `GET /trending` - Get trending movies and TV shows from TMDb

## Development

### Available Scripts

#### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production

#### Server
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
