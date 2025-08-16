import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { FiUser } from 'react-icons/fi';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import FastPrintLogo from '../assets/images/fastlogo.svg';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const productRef = useRef();
  const resourceRef = useRef();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    // Update cart count on mount & when cart localStorage changes
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cart.length);
    };

    updateCartCount();

    // Listen for storage events to update count across tabs/windows
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productRef.current && !productRef.current.contains(event.target)) {
        setProductOpen(false);
      }
      if (resourceRef.current && !resourceRef.current.contains(event.target)) {
        setResourceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when clicking on a link
  const handleMobileLinkClick = () => {
    setMenuOpen(false);
    setProductOpen(false);
    setResourceOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/userdashboard');
    } else {
      navigate('/login');
    }
    setMenuOpen(false);
  };

  const handleCartClick = () => {
    if (user) {
      navigate('/orders');
    } else {
      navigate('/login');
    }
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
          <img 
  src={FastPrintLogo} 
  alt="Fast Print Guys Logo" 
  className="w-16 h-16 sm:w-20 sm:h-55 transition-transform duration-200 hover:scale-105" 
/>

          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-medium text-gray-700 text-sm xl:text-base">
            <Link to="/" className="hover:text-blue-600 transition-colors duration-200">
              Home
            </Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors duration-200">
              About Us
            </Link>
            <Link to="/products" className="hover:text-blue-600 flex items-center gap-1 transition-colors duration-200">
              Products
            </Link>
            <Link to="/calculator/printbook" className="hover:text-blue-600 transition-colors duration-200">
              Pricing
            </Link>
            <Link to="/print-shop" className="hover:text-blue-600 transition-colors duration-200">
              Print Shop
            </Link>
            <Link to="/portfolio" className="hover:text-blue-600 transition-colors duration-200">
              Portfolio
            </Link>
            <Link to="/services" className="hover:text-blue-600 transition-colors duration-200">
              Services
            </Link>

            {/* Resources Dropdown */}
            <div
              className="relative"
              ref={resourceRef}
              onMouseEnter={() => setResourceOpen(true)}
              onMouseLeave={() => setResourceOpen(false)}
            >
             
              {resourceOpen && (
                <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-lg z-20 min-w-52 border border-gray-100">
                  <div className="py-2">
                    <Link to="/resources/guidetemplates" className="block px-4 py-2 hover:bg-gray-50 transition-colors duration-200 text-sm">
                      Guide & Templates
                    </Link>
                    <Link to="/resources/blogs" className="block px-4 py-2 hover:bg-gray-50 transition-colors duration-200 text-sm">
                      Blogs
                    </Link>
                    <Link to="/resources/publishing" className="block px-4 py-2 hover:bg-gray-50 transition-colors duration-200 text-sm">
                      Publishing Resources
                    </Link>
                    <Link to="/resources/contactresources" className="block px-4 py-2 hover:bg-gray-50 transition-colors duration-200 text-sm">
                      Contact Resources
                    </Link>
                    <Link to="/resources/hireprofessional" className="block px-4 py-2 hover:bg-gray-50 transition-colors duration-200 text-sm">
                      Hire Professional
                    </Link>
                    <Link to="/resources/orderlookup" className="block px-4 py-2 hover:bg-gray-50 transition-colors duration-200 text-sm">
                      Order Lookup
                    </Link>
                    <Link to="/resources/planproject" className="block px-4 py-2 hover:bg-gray-50 transition-colors duration-200 text-sm">
                      Plan Project
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 xl:px-6 py-2 text-xs xl:text-sm font-medium border rounded-full transition-all duration-300"
                style={{
                  color: '#0096CD',
                  borderColor: '#0096CD',
                  backgroundColor: 'white',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2A428C';
                  e.target.style.color = '#fff';
                  e.target.style.borderColor = '#2A428C';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#0096CD';
                  e.target.style.borderColor = '#0096CD';
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 xl:px-6 py-2 text-xs xl:text-sm font-medium border rounded-full transition-all duration-300"
                style={{
                  color: '#0096CD',
                  borderColor: '#0096CD',
                  backgroundColor: 'white',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#2A428C';
                  e.target.style.color = '#fff';
                  e.target.style.borderColor = '#2A428C';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#0096CD';
                  e.target.style.borderColor = '#0096CD';
                }}
              >
                Login
              </Link>
            )}

            {/* Cart Icon with Badge */}
            <div className="relative cursor-pointer" onClick={handleCartClick} title="Cart">
              <HiOutlineShoppingBag size={20} className="text-gray-700 hover:text-blue-600 transition-colors duration-200" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center text-[10px] font-bold text-white bg-red-600 rounded-full w-4 h-4 min-w-[16px]">
                  {cartCount}
                </span>
              )}
            </div>

            {/* Profile Icon */}
            <FiUser
              size={20}
              className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors duration-200"
              onClick={handleProfileClick}
              title="Profile"
            />
          </div>

          {/* Mobile Menu Button and Icons */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Mobile Cart Icon */}
            <div className="relative cursor-pointer" onClick={handleCartClick} title="Cart">
              <HiOutlineShoppingBag size={18} className="text-gray-700 hover:text-blue-600 transition-colors duration-200" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center text-[9px] font-bold text-white bg-red-600 rounded-full w-3.5 h-3.5 min-w-[14px]">
                  {cartCount}
                </span>
              )}
            </div>

            {/* Mobile Profile Icon */}
            <FiUser
              size={18}
              className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors duration-200"
              onClick={handleProfileClick}
              title="Profile"
            />

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <nav className="py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-1">
              <Link 
                to="/" 
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                onClick={handleMobileLinkClick}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                onClick={handleMobileLinkClick}
              >
                About Us
              </Link>
              <Link 
                to="/products" 
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                onClick={handleMobileLinkClick}
              >
                Products
              </Link>
              <Link 
                to="/calculator/printbook" 
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                onClick={handleMobileLinkClick}
              >
                Pricing
              </Link>
              <Link 
                to="/print-shop" 
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                onClick={handleMobileLinkClick}
              >
                Print Shop
              </Link>
              <Link 
                to="/portfolio" 
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                onClick={handleMobileLinkClick}
              >
                Portfolio
              </Link>

              {/* Mobile Resources Section */}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={() => setResourceOpen(!resourceOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                >
                  <span>Resources</span>
                  <IoIosArrowDown className={`transition-transform duration-200 ${resourceOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`transition-all duration-300 ease-in-out ${resourceOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <div className="pl-4 space-y-1">
                    <Link 
                      to="/resources/guidetemplates" 
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                      onClick={handleMobileLinkClick}
                    >
                      Guide & Templates
                    </Link>
                    <Link 
                      to="/resources/blogs" 
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                      onClick={handleMobileLinkClick}
                    >
                      Blogs
                    </Link>
                    <Link 
                      to="/resources/publishing" 
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                      onClick={handleMobileLinkClick}
                    >
                      Publishing Resources
                    </Link>
                    <Link 
                      to="/resources/contactresources" 
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                      onClick={handleMobileLinkClick}
                    >
                      Contact Resources
                    </Link>
                    <Link 
                      to="/resources/hireprofessional" 
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                      onClick={handleMobileLinkClick}
                    >
                      Hire Professional
                    </Link>
                    <Link 
                      to="/resources/orderlookup" 
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                      onClick={handleMobileLinkClick}
                    >
                      Order Lookup
                    </Link>
                    <Link 
                      to="/resources/planproject" 
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200 rounded-md"
                      onClick={handleMobileLinkClick}
                    >
                      Plan Project
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile Auth Button */}
              <div className="border-t border-gray-100 mt-4 pt-4 px-4">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm font-medium border rounded-full transition-all duration-300"
                    style={{
                      color: '#0096CD',
                      borderColor: '#0096CD',
                      backgroundColor: 'white',
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2 text-sm font-medium border rounded-full text-center transition-all duration-300"
                    style={{
                      color: '#0096CD',
                      borderColor: '#0096CD',
                      backgroundColor: 'white',
                    }}
                    onClick={handleMobileLinkClick}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Bottom Gradient Border */}
      <div className="w-full h-1.5 bg-gradient-to-r from-pink-400 to-purple-600"></div>
    </header>
  );
};

export default Header;
