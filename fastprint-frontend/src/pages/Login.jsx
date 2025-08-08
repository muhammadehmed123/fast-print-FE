import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/images/Fast-Print-Guys-Final-Logo.svg";
import LoginImage from "../assets/images/left-gradient.png"; // Use your actual image
import Leftimg from "../assets/images/left-auth.png"

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  try {
    // login() should return user info including is_admin flag
    const user = await login(form);
    
    if (user?.is_admin) {
      navigate("/admin");  // Redirect admin users here
    } else {
      navigate("/account-settings"); // Redirect regular users here
    }
  } catch (err) {
    setError("Invalid or unverified account");
  }
};


  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side */}
      <div
        className="md:w-1/2 relative flex items-center justify-center"
        style={{ backgroundColor: "rgba(4, 22, 67, 1)" }}
      >
        {/* Background image */}
        <img
          src={LoginImage}
          alt="Background Illustration"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        {/* Logo */}
        <div className="absolute top-4 left-6 z-10">
          <img src={Logo} alt="Logo" className="w-20 h-auto object-contain" />
        </div>

        {/* First image (centered below logo) */}
        <img
          src={Leftimg}
          alt="Decorative"
          className="absolute top-28 left-1/2 transform -translate-x-1/2 w-40 z-10"
        />

        {/* Second image (slightly right and lower) */}
        <img
          src={Leftimg}
          alt="Decorative"
          className="absolute top-52 left-[60%] w-32 z-10"
        />
      </div>

      {/* Right Side */}
      <div
        className="md:w-1/2 flex flex-col justify-start px-12 py-8"
        style={{ backgroundColor: "rgba(229, 251, 255, 1)" }}
      >
        {/* Heading */}
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Welcome Back <span className="inline-block text-xl">👋</span>
          </h1>

          {/* Underlines */}
          <div
            className="mt-2"
            style={{
              height: "2px",
              width: "150px",
              backgroundColor: "rgba(1, 106, 179, 1)",
            }}
          ></div>
          <div
            className="mt-1"
            style={{
              height: "2px",
              width: "75px",
              backgroundColor: "rgba(1, 106, 179, 1)",
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="mt-10 flex flex-col items-start gap-6 max-w-sm mx-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800">
            Login Your Account
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              required
              className="h-[40px] rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
            />
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
              className="h-[40px] rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
            />
            <button
              type="submit"
              className="h-[36px] rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: "rgba(0, 150, 205, 1)" }}
            >
              Login
            </button>
          </form>

          {error && (
            <p className="text-red-600 text-xs text-center w-full">{error}</p>
          )}

          <p className="text-gray-700 text-xs text-center w-full">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold"
              style={{ color: "rgba(1, 106, 179, 1)" }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
