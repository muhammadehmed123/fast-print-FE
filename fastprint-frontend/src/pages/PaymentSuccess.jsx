import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PaymentSuccess = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
        <h1 className="text-3xl font-bold text-green-700 mb-4">Payment Successful! 🎉</h1>
        <p className="text-lg text-gray-700 mb-6">
          Thank you for your purchase. Your payment has been processed.
        </p>
        <Link
          to="/"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full"
        >
          Back to Home
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default PaymentSuccess;
