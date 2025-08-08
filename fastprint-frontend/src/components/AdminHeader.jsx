import React from 'react';
import { useNavigate } from 'react-router-dom';
import FastPrintLogo from '../assets/images/Fast-Print-Guys-Final-Logo.svg';
import useAuth from '../hooks/useAuth';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo */}
        <div>
          <img src={FastPrintLogo} alt="Fast Print Guys Logo" className="w-12 h-12" />
        </div>

        {/* Right: Logout Button */}
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
      </div>

      {/* Gradient Border */}
      <svg width="1440" height="6" viewBox="0 0 1440 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="1440" height="6" transform="matrix(1 0 0 -1 0 6)" fill="url(#paint0_linear_102_3521)" />
        <defs>
          <linearGradient id="paint0_linear_102_3521" x1="547.776" y1="3" x2="1749.68" y2="3" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D15D9E" />
            <stop offset="1" stopColor="#5D4495" />
          </linearGradient>
        </defs>
      </svg>
    </header>
  );
};

export default AdminHeader;
