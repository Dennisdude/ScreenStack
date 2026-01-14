import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-blue-400">
          ScreenStack
        </Link>
        <div className="space-x-6 font-medium">
          <Link to="/" className="hover:text-blue-300 transition">Entdecken</Link>
          <Link to="/watchlist" className="hover:text-blue-300 transition">Meine Liste</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;