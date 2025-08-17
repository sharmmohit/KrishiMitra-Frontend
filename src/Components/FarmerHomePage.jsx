import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLeaf,
  faTractor,
  faSignOutAlt,
  faCloudUpload,
  faListAlt,
  faArrowRight,
  faUserCircle,
  faCog,
  faShoppingBag,
  faBoxOpen  // ✅ Missing import added here
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

function FarmerHomePage() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const email = localStorage.getItem("email") || 'Farmer';
  const [farmer, setFarmer] = useState(null);
    
  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
        fetch(`http://localhost:8080/api/farmer/${email}`)
            .then(res => res.json())
            .then(data => setFarmer(data))
            .catch(err => console.error("Failed to load farmer", err));
    }
  }, []);

  const listingsurl = `/farmer/crop-listings?email=${encodeURIComponent(email)}`;

  const handleEditProfile = () => {
    setIsDropdownOpen(false);
    navigate('/farmer/profile/edit');
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    const email = localStorage.getItem("email");
    if (email) {
        localStorage.removeItem(`cart-${email}`); // Optional for farmer
        localStorage.removeItem("email");
    }
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <Link to="/" className="text-green-700 font-bold text-2xl flex items-center hover:opacity-80">
              <FontAwesomeIcon icon={faLeaf} className="mr-2 text-green-600 animate-pulse" />
                  CropBoom
        </Link>

        <div className="flex flex-col items-end">
          <div className="flex items-center text-green-700 font-semibold text-lg">
            <FontAwesomeIcon icon={faTractor} size="lg" className="mr-2" />
            Welcome, Farmer!
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Logged in as: <span className="font-medium">{email}</span>
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="flex items-center">
            <FontAwesomeIcon icon={faUserCircle} size="lg" className="text-gray-600 hover:text-gray-800" />
            <span className="ml-2 hidden md:inline">{farmer?.name || 'Farmer'}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md z-50 overflow-hidden">
              <div className="px-4 py-3 border-b">
                <p className="font-medium">{farmer?.name || 'User'}</p>
                <p className="text-sm text-gray-600 truncate">{farmer?.email || ''}</p>
              </div>
              <Link to="/farmer/profile" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">
                <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                My Profile
              </Link>
              <Link to="/farmer/products" className="block px-4 py-2 hover:bg-gray-100 text-gray-700">
                <FontAwesomeIcon icon={faBoxOpen} className="mr-2" />
                My Crops
              </Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 border-t">
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 flex justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* Upload Your Crop for Sell Box */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-center items-center p-8">
            <div className="text-green-600 text-6xl mb-6">
              <FontAwesomeIcon icon={faCloudUpload} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Upload Crop</h2>
            <p className="text-gray-600 text-center text-lg mb-6">List your harvested crops for sale.</p>
            <button
              onClick={() => navigate('/farmer/upload-crop', { state: { email } })}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-300 flex items-center"
              aria-label="Upload crops for sale"
            >
              Upload Now
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </button>
          </div>

          {/* My Crop Listing Box */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-center items-center p-8">
            <div className="text-blue-600 text-6xl mb-6">
              <FontAwesomeIcon icon={faListAlt} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">My Listings</h2>
            <p className="text-gray-600 text-center text-lg mb-6">View and manage your listed crops.</p>
            <Link
              to={listingsurl}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-300 flex items-center"
            >
              View Listings
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          </div>

          {/* Bookings & Sold Crops Box */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-center items-center p-8">
            <div className="text-purple-600 text-6xl mb-6">
              <FontAwesomeIcon icon={faShoppingBag} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Bookings & Sales</h2>
            <p className="text-gray-600 text-center text-lg mb-6">View your sold crops and buyer bookings.</p>
            <Link
              to="/farmer/bookings"
              state={{ email }}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition-colors duration-300 flex items-center"
              aria-label="View bookings and sales"
            >
              View Bookings
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} CropBoom. All rights reserved.
      </footer>
    </div>
  );
}

FarmerHomePage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      email: PropTypes.string
    })
  })
};

export default FarmerHomePage;
