import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { FiUser } from 'react-icons/fi';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import FastPrintLogo from '../assets/images/Fast-Print-Guys-Final-Logo.svg';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // <-- cart count state

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

    // Optionally, you can listen for storage events to update count across tabs/windows
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/userdashboard');
    } else {
      navigate('/login');
    }
  };

  const handleCartClick = () => {
    if (user) {
      navigate('/orders');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img src={FastPrintLogo} alt="Fast Print Guys Logo" className="w-12 h-12" />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link to="/about" className="hover:text-blue-600">
            About Us
          </Link>

          {/* Products Dropdown */}
          <div
            className="relative"
            ref={productRef}
            onMouseEnter={() => setProductOpen(true)}
            onMouseLeave={() => setProductOpen(false)}
          >
            <button className="hover:text-blue-600 flex items-center gap-1">
              Products <IoIosArrowDown />
            </button>
            {productOpen && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg p-2 rounded z-10">
                <Link to="/products/printbook" className="block px-4 py-2 hover:bg-gray-100">
                  Print Book
                </Link>
                <Link to="/products/comicbook" className="block px-4 py-2 hover:bg-gray-100">
                  Comic Book
                </Link>
                <Link to="/products/cookbook" className="block px-4 py-2 hover:bg-gray-100">
                  Cookbook
                </Link>
                <Link to="/products/ebook" className="block px-4 py-2 hover:bg-gray-100">
                  Ebook
                </Link>
                <Link to="/products/photobook" className="block px-4 py-2 hover:bg-gray-100">
                  Photo Book
                </Link>
                <Link to="/products/printmagzine" className="block px-4 py-2 hover:bg-gray-100">
                  Print Magazine
                </Link>
                <Link to="/products/yearbook" className="block px-4 py-2 hover:bg-gray-100">
                  Year Book
                </Link>
              </div>
            )}
          </div>

          <Link to="/calculator/printbook" className="hover:text-blue-600">
            Pricing
          </Link>
          <Link to="/print-shop" className="hover:text-blue-600">
            Print Shop
          </Link>
          <Link to="/portfolio" className="hover:text-blue-600">
            Portfolio
          </Link>

          {/* Resources Dropdown */}
          <div
            className="relative"
            ref={resourceRef}
            onMouseEnter={() => setResourceOpen(true)}
            onMouseLeave={() => setResourceOpen(false)}
          >
            <button className="hover:text-blue-600 flex items-center gap-1">
              Resources <IoIosArrowDown />
            </button>
            {resourceOpen && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg p-2 rounded z-10">
                <Link to="/resources/guidetemplates" className="block px-4 py-2 hover:bg-gray-100">
                  Guide & Templates
                </Link>
                <Link to="/resources/blogs" className="block px-4 py-2 hover:bg-gray-100">
                  Blogs
                </Link>
                <Link to="/resources/publishing" className="block px-4 py-2 hover:bg-gray-100">
                  Publishing Resources
                </Link>
                <Link to="/resources/contactresources" className="block px-4 py-2 hover:bg-gray-100">
                  Contact Resources
                </Link>
                <Link to="/resources/hireprofessional" className="block px-4 py-2 hover:bg-gray-100">
                  Hire Professional
                </Link>
                <Link to="/resources/orderlookup" className="block px-4 py-2 hover:bg-gray-100">
                  Order Lookup
                </Link>
                <Link to="/resources/planproject" className="block px-4 py-2 hover:bg-gray-100">
                  Plan Project
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3 relative">
          {user ? (
            <button
              onClick={handleLogout}
              className="px-6 py-2 text-sm font-medium border rounded-full transition-all duration-300"
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
              className="px-6 py-2 text-sm font-medium border rounded-full transition-all duration-300"
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
            <HiOutlineShoppingBag size={20} className="text-gray-700 hover:text-blue-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center text-[10px] font-bold text-white bg-red-600 rounded-full w-4 h-4">
  {cartCount}
</span>

            )}
          </div>

          {/* Profile Icon with Conditional Redirect */}
          <FiUser
            size={20}
            className="text-gray-700 hover:text-blue-600 cursor-pointer"
            onClick={handleProfileClick}
            title="Profile"
          />
        </div>
      </div>

      {/* Bottom Gradient Border */}
      <svg
        width="1440"
        height="6"
        viewBox="0 0 1440 6"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          width="1440"
          height="6"
          transform="matrix(1 0 0 -1 0 6)"
          fill="url(#paint0_linear_102_3521)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_102_3521"
            x1="547.776"
            y1="3"
            x2="1749.68"
            y2="3"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D15D9E" />
            <stop offset="1" stopColor="#5D4495" />
          </linearGradient>
        </defs>
      </svg>
    </header>
  );
};

export default Header;
