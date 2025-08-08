import React from "react";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PaymentImage from "../assets/images/payment-image.png";
import Marketing from "../assets/images/marketing.png";
import Newsletter from "../assets/images/newsletter.png";
import PersonalIcon from "../assets/images/newsletter.png";
import BusinessIcon from "../assets/images/newsletter.png";

export default function AccountSettings() {
  const { user } = useAuth();

  return (
    <>
      <Header />

      {/* Gradient Bar Below Header */}
      <div className="w-full h-[51px] flex items-center px-6 bg-gradient-to-r from-[#016AB3] via-[#0096CD] to-[#00AEDC]">
        <h1 className="text-white text-lg font-semibold">Account Settings</h1>
      </div>

      {/* Outer Background */}
      <div className="w-full min-h-screen py-12 bg-gradient-to-br from-[#eef4ff] to-[#fef6fb]">
        {/* Main Container */}
        <div className="w-[909px] mx-auto p-10 rounded-2xl shadow-xl flex flex-col gap-10 bg-gradient-to-r from-[#ffe4ec] via-[#fdfdfd] to-[#e0f3ff]">
          
          {/* Section Header */}
          <div className="relative flex justify-center items-center">
            <div className="absolute left-0 right-0 h-[4px] bg-gradient-to-r from-[#D15D9E] to-[#5D4495] z-0" />
            <div className="h-[47px] w-[440px] flex items-center justify-center text-white font-medium text-md bg-gradient-to-r from-[#D15D9E] to-[#5D4495] rounded-full z-10">
              Account Overview
            </div>
          </div>

          {/* Login Data */}
          <div className="w-full">
            <h2 className="text-[#2A428C] font-bold text-[30px] mb-2">Login Data</h2>
            <hr className="border-black mb-6" />
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input type="email" id="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" id="password" placeholder="Enter your password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex items-center w-full h-[149px] border border-white rounded-[10px] px-8 py-6 shadow-sm bg-[#002B48]">
            <div className="flex flex-col justify-center w-[60%] gap-1">
              <h3 className="text-[#0096CD] font-semibold text-lg">Payments Method</h3>
              <p className="text-white text-sm">Save Payment Method During Checkouts</p>
              <p className="text-white text-xs">You have no stored payment methods</p>
            </div>
            <div className="w-[40%] h-full flex items-center justify-end">
              <img src={PaymentImage} alt="Payment" className="h-full object-contain max-w-full" />
            </div>
          </div>

          {/* Marketing Preferences */}
          <div className="w-full h-[149px] border border-white rounded-[10px] px-8 py-6 text-white shadow-sm bg-gradient-to-r from-[#D15D9E] to-[#5D4495]">
            <h3 className="font-semibold text-lg mb-2">Marketing Preferences</h3>
            <p className="text-sm leading-snug">Help us customize your experience by selecting an account type.</p>
          </div>

          {/* Email Preferences */}
          <div className="w-full">
            <h2 className="text-[#2A428C] font-bold text-[36px] mb-2">FastPrint Guys Email Preferences</h2>
            <hr className="border-black mb-4" />
          </div>

          {/* Marketing Email */}
          <div className="w-full border border-[#ECECEC] rounded-[20px] px-6 py-6 flex items-center gap-4 shadow-sm bg-[#2A428C]">
            <img src={Marketing} alt="Marketing Email" className="h-[40px] w-[40px] object-contain ml-1" />
            <div>
              <h3 className="text-white font-semibold text-base mb-1">Marketing & Promotional Emails</h3>
              <p className="text-white text-sm">Send me promotional info including discounts.</p>
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full border border-[#ECECEC] rounded-[20px] px-6 py-8 flex items-center gap-4 shadow-sm bg-white">
            <img src={Newsletter} alt="Newsletter" className="h-[48px] w-[48px] object-contain ml-1" />
            <div>
              <h3 className="text-black font-semibold text-base mb-1">FastPrint Guys Newsletter</h3>
              <p className="text-black text-sm">Get the latest publishing and writing news.</p>
            </div>
          </div>

          {/* Account Type */}
          <div className="w-full">
            <h2 className="text-[#2A428C] font-bold text-[36px] mb-2">Account Type</h2>
            <hr className="border-black mb-4" />
          </div>

          {/* Personal Account */}
          <div className="w-full border border-[#ECECEC] rounded-[20px] px-6 py-6 flex items-center gap-4 shadow-sm bg-white mb-4">
            <img src={PersonalIcon} alt="Personal" className="h-[48px] w-[48px] object-contain ml-1" />
            <div>
              <h3 className="text-black font-semibold text-base mb-1">Personal</h3>
              <p className="text-black text-sm">I print books for personal use or as gifts.</p>
            </div>
          </div>

          {/* Business Account */}
          <div className="w-full border border-[#ECECEC] rounded-[20px] px-6 py-6 flex items-center gap-4 shadow-sm bg-white">
            <img src={BusinessIcon} alt="Business" className="h-[48px] w-[48px] object-contain ml-1" />
            <div>
              <h3 className="text-black font-semibold text-base mb-1">Business</h3>
              <p className="text-black text-sm">I publish books for business or resale.</p>
            </div>
          </div>

          {/* Cancel Account */}
          <div className="w-full">
            <h2 className="text-[#2A428C] font-bold text-[36px] mb-2">Account Management</h2>
            <hr className="border-black mb-4" />
            <h3 className="text-black font-semibold text-lg mb-3">Cancel Your Account</h3>

            <div className="w-full border border-[#ECECEC] rounded-[20px] px-6 py-6 flex flex-col justify-between shadow-sm bg-white">
              <p className="text-black text-sm mb-4">
                Canceling your account is permanent. All projects will be retired and removed.
              </p>
              <button className="text-white text-[20px] font-bold capitalize w-full py-4 rounded-full shadow-xl bg-gradient-to-r from-[#016AB3] via-[#0096CD] to-[#00AEDC]">
                Cancel Your Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
