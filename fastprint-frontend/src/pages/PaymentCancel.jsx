import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PaymentCancel = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 px-4">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Payment Cancelled ❌</h1>
        <p className="text-lg text-gray-700 mb-6">
          You cancelled the payment. If this was a mistake, you can try again.
          Please Again PLace Your Order
        </p>
        <Link
          to="/design-project"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full"
        >
          Try Again
        </Link>
      </div>
      <Footer />
    </>
  );
};

export default PaymentCancel;
