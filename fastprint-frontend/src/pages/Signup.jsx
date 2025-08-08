import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../assets/images/Fast-Print-Guys-Final-Logo.svg';
import Leftimg from '../assets/images/left-auth.png'; // Decorative image

const Signup = () => {
  const [form, setForm] = useState({ email: '', name: '', password: '' });
  const [message, setMessage] = useState('');
  const [formDisabled, setFormDisabled] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setFormDisabled(true);
    try {
      await register(form);
      setMessage('Registered successfully! Please check your email to verify your account.');
      // Optionally clear form or redirect after delay
      // setTimeout(() => navigate('/login'), 5000);
    } catch (err) {
      // Extract backend error message if available
      const errorMsg =
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        'Registration failed. Please try again.';
      setMessage(errorMsg);
      setFormDisabled(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side */}
      <div
        className="md:w-1/2 relative flex flex-col items-center justify-center p-8"
        style={{ backgroundColor: 'rgba(4, 22, 67, 1)' }}
      >
        {/* Logo */}
        <div className="absolute top-4 left-6 z-10">
          <img src={Logo} alt="Logo" className="w-20 h-auto object-contain" />
        </div>

        {/* First Decorative Image */}
        <img
          src={Leftimg}
          alt="Decorative"
          className="absolute top-28 left-1/2 transform -translate-x-1/2 w-40 z-10"
        />

        {/* Second Decorative Image */}
        <img
          src={Leftimg}
          alt="Decorative"
          className="absolute top-52 left-[60%] w-32 z-10"
        />
      </div>

      {/* Right Side */}
      <div
        className="md:w-1/2 flex flex-col justify-center p-8"
        style={{ backgroundColor: 'rgba(229, 251, 255, 1)', paddingLeft: '8rem' }}
      >
        {/* Heading */}
        <h2 className="text-xl font-semibold mb-10 text-gray-900 w-[153px] h-[19px] whitespace-nowrap">
          Signup Now
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-7">
          <input
            type="text"
            name="name"
            onChange={handleChange}
            placeholder="Username"
            required
            disabled={formDisabled}
            className="w-[400px] h-[45px] rounded-[10px] border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
          />
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Email"
            required
            disabled={formDisabled}
            className="w-[400px] h-[45px] rounded-[10px] border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            required
            disabled={formDisabled}
            className="w-[400px] h-[45px] rounded-[10px] border border-gray-300 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={formDisabled}
            className="w-[400px] h-[36px] rounded-[100px] text-sm font-medium text-white flex justify-center items-center disabled:opacity-50"
            style={{ backgroundColor: 'rgba(0, 150, 205, 1)' }}
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p className="mt-4 text-red-600 text-xs text-center w-[400px]">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-700 text-xs w-[400px]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold"
            style={{ color: 'rgba(1, 106, 179, 1)' }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
