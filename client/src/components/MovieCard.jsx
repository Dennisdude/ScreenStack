const MovieCard = ({ item, onAction, actionLabel, isDestructive = false }) => {
  const displayTitle = item.title || item.name;
  
  const displayDate = item.release_date || item.first_air_date;
  const year = displayDate ? displayDate.substring(0, 4) : 'N/A';

  const imageUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w300${item.poster_path}` 
    : 'https://via.placeholder.com/300x450?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative aspect-[2/3]">
        <img 
          src={imageUrl} 
          alt={displayTitle} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {item.media_type === 'tv' || !item.title ? 'TV Serie' : 'Film'}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-1 leading-tight">{displayTitle}</h3>
        <p className="text-gray-500 text-sm mb-4">{year}</p>
        
        <button 
          onClick={() => onAction(item)}
          className={`mt-auto w-full py-2 px-4 rounded font-semibold transition-colors ${
            isDestructive 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;