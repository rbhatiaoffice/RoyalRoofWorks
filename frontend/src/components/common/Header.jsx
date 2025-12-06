import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            RoyalRoofWorks
          </Link>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className={`hover:text-primary-600 transition-colors ${
                  isActive('/') ? 'text-primary-600 font-semibold' : 'text-gray-700'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className={`hover:text-primary-600 transition-colors ${
                  isActive('/services') ? 'text-primary-600 font-semibold' : 'text-gray-700'
                }`}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className={`hover:text-primary-600 transition-colors ${
                  isActive('/gallery') ? 'text-primary-600 font-semibold' : 'text-gray-700'
                }`}
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                to="/reviews"
                className={`hover:text-primary-600 transition-colors ${
                  isActive('/reviews') ? 'text-primary-600 font-semibold' : 'text-gray-700'
                }`}
              >
                Reviews
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`hover:text-primary-600 transition-colors ${
                  isActive('/contact') ? 'text-primary-600 font-semibold' : 'text-gray-700'
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;

