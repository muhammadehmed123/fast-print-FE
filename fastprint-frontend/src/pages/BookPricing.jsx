import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Book1 from "../assets/images/bookpricing1.png";
import Book2 from "../assets/images/bookpricing2.png";
import Footer from "../components/Footer";

const BookPricing = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/design-project");
  };
  const paymentHandler=()=>{
    navigate("/shop")
  }

  return (
    <>
      <Header />

      {/* Pricing Top Bar (Waji Style) */}
      <div
        className="w-full h-[51px] flex items-center px-6"
        style={{
          background:
            "linear-gradient(90deg, #016AB3 16.41%, #0096CD 60.03%, #00AEDC 87.93%)",
        }}
      >
        <h1 className="text-white text-lg font-semibold font-sans">Pricing</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center bg-[#f9f9f9] py-8 min-h-screen font-sans">
        {/* Heading */}
        <h1 className="text-[32px] font-bold text-[#2A428C] mb-5 text-center">
          Sales & Payments
        </h1>

        {/* Revenue Box */}
        <div className="w-[909px] bg-white border border-[#ECECEC] rounded-[20px] p-6 flex flex-col items-center text-center gap-2">
          <p className="text-[28px] font-bold text-black m-0">0.00 USD</p>
          <p className="text-[14px] text-[#4A4A4A] m-0">Total unpaid revenue</p>

          <button className="mt-4 w-[240px] h-[38px] bg-gradient-to-r from-[#0060A9] via-[#0096CD] to-[#00AEDC] text-white rounded-full text-[15px] font-medium capitalize flex items-center justify-center" onClick={paymentHandler}>
            Payment Overview
          </button>
        </div>

        {/* Note Below */}
        <p className="text-[13px] text-[#4A4A4A] mt-4 text-center">
          Estimated Payment after tax withholding, based on today's currency conversion rates.
        </p>

        {/* No Sales Message Box */}
        <div className="relative w-[800px] h-[400px] bg-gradient-to-br from-[#0060A9] via-[#0096CD] to-[#00AEDC] rounded-[20px] mx-auto my-24 flex flex-col items-center justify-center text-center text-white p-6 shadow-xl overflow-hidden">

          {/* Top-Left Corner Images */}
          <img src={Book1} alt="Decor Top Left 1" className="absolute top-4 left-4 w-12 h-12" />
          <img src={Book2} alt="Decor Top Left 2" className="absolute top-16 left-12 w-10 h-10" />

          {/* Bottom-Right Corner Images */}
          <img src={Book1} alt="Decor Bottom Right 1" className="absolute bottom-4 right-4 w-14 h-14" />
          <img src={Book2} alt="Decor Bottom Right 2" className="absolute bottom-16 right-12 w-10 h-10" />

          {/* Text */}
          <h1 className="text-[28px] font-bold leading-tight">You don't have any sales yet</h1>
          <p className="text-[16px] mt-5">
            Sales, revenue earnings, and payments will be displayed here.
          </p>

          {/* Project Overview Button */}
          <button
            onClick={handleNavigate}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-[#F8C20A] to-[#EE831E] text-white text-[16px] font-medium rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Project Overview
          </button>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default BookPricing;
