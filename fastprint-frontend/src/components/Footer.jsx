import React from "react";
import {
  FaHome,
  FaBoxOpen,
  FaBlog,
  FaPrint,
  FaShoppingBag,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaTwitter,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaPaperPlane,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      className="w-full relative"
      style={{
        background:
          "linear-gradient(90deg, #016AB3 16.41%, #0096CD 60.03%, #00AEDC 87.93%)",
      }}
    >
      {/* Main Content */}
      <div className="w-full px-10 py-10 flex justify-between text-white">
        {/* Left Section */}
        <div className="flex flex-col gap-6 w-1/2">
          {/* Top Icons */}
          <div className="flex gap-6 text-[16px] font-medium">
            <div className="flex items-center gap-2">
              <FaHome />
              <span>Home</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBoxOpen />
              <span>Products</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBlog />
              <span>Blog</span>
            </div>
            
          
          </div>

          {/* Social Icons */}
          <div className="flex gap-6 text-xl mt-2">
            <FaTwitter className="cursor-pointer" />
            <FaInstagram className="cursor-pointer" />
            <FaFacebookF className="cursor-pointer" />
            <FaLinkedinIn className="cursor-pointer" />
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 mt-4">
            <FaPhoneAlt />
            <span>
+1 469-277-7489 </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt />
            <span>
+1 469-277-7489</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-4 w-1/2">
          <p className="text-[16px] leading-[24px] max-w-md">
            This is a paragraph with more information about something important.
          </p>

          <h4 className="text-lg font-semibold mt-4">Subscribe</h4>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-[300px] rounded-full outline-none text-black text-sm"
            />
            <button
              className="p-3 rounded-full"
              style={{
                background: "purple",
                color: "white",
              }}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>

      {/* Yellow Line & Bottom Row - inside gradient */}
      <div className="w-full border-t-4 border-yellow-400 mt-2" />

      <div className="flex justify-between items-center px-10 py-4 text-white text-sm">
        <span>© 2025 Your Company</span>
        <div className="flex gap-4">
          <span className="cursor-pointer hover:underline">Privacy Policy</span>
          <span className="cursor-pointer hover:underline">Terms & Conditions</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
