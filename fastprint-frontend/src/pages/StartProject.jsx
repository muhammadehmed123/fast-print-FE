import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BASE_URL } from "../services/baseURL";

// Images
import Image1 from "../assets/images/startproject1.png";
import Image2 from "../assets/images/startproject2.png";
import Image3 from "../assets/images/startproject3.png";
import Image4 from "../assets/images/startproject4.png";
import Image5 from "../assets/images/startproject5.png";
import Image6 from "../assets/images/startproject6.png";
import Image7 from "../assets/images/startproject7.png";

// ✅ Product Cards
const productCards = [
  {
    id: 1,
    image: Image1,
    title: "Print Book",
    description:
      "Hardcover or paperback book using a wide range of paper, color, and binding options.",
    calculator: "PrintBookCalculator",
  },
  {
    id: 2,
    image: Image2,
    title: "Photo Book",
    description: "The most common print-on-demand book, perfect for a variety of projects.",
    calculator: "PhotoBookCalculator",
  },
  {
    id: 3,
    image: Image3,
    title: "Comic Book",
    description: "Perfect for comic lover who want to print in vibrant color.",
    calculator: "ComicBookCalculator",
  },
  {
    id: 4,
    image: Image4,
    title: "Magazine",
    description: "Publish magazines using modern and attractive layouts.",
    calculator: "MagazineCalculator",
  },
  {
    id: 5,
    image: Image5,
    title: "Year Book",
    description: "Create journals for personal reflection or business records.",
    calculator: "YearBookCalculator",
  },
  {
    id: 6,
    image: Image6,
    title: "Calender",
    description: "Organize your daily, weekly, or monthly schedule.",
    calculator: "CalendarCalculator",
  },
  {
    id: 7,
    image: Image7,
    title: "e Book",
    description: "Showcase your work in a professional digital format.",
    calculator: "EBookCalculator",
  },
];

const StartProject = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  useEffect(() => {
    console.log("Selected Language:", selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    console.log("Selected Category:", selectedCategory);
  }, [selectedCategory]);


  const handleButtonClick = () => {
    if (!text.trim()) {
      alert("Please enter project details.");
      return;
    }
    if (!selectedCategory) {
      alert("Please select a book category.");
      return;
    }
    
    // Navigate to design project page with state
    navigate("/design-project", {
      state: {
        projectTitle: text,
        language: selectedLanguage,
        category: selectedCategory,
      },
    });
  };

  return (
    <>
      <Header />

      {/* Navigation Tabs */}
      <div
        className="w-full h-[51px] flex items-center justify-center gap-8"
        style={{
          background: "linear-gradient(90deg, #016AB3 16.41%, #0096CD 60.03%, #00AEDC 87.93%)",
        }}
      >
        <span
          className="text-white text-lg font-semibold cursor-pointer pb-1 border-b-4 border-transparent hover:border-yellow-400 transition-all"
          onClick={() => navigate("/start-project")}
        >
          Start Project
        </span>
        <span
          className="text-white text-lg font-semibold cursor-pointer pb-1 border-b-4 border-transparent hover:border-yellow-400 transition-all"
          onClick={() => navigate("/design-project")}
        >
          Designs
        </span>
      </div>

      <div
        className="w-full min-h-screen"
        style={{
          background: "linear-gradient(135deg, #eef4ff, #fez6fb)",
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <div className="w-full flex justify-center items-start" style={{ minHeight: "100vh" }}>
          <div
            className="rounded-2xl shadow-lg pt-8 pb-10 px-8 flex flex-col gap-6"
            style={{
              width: "70%",
              background: "linear-gradient(to right, #ffe4ec, #fdfdfd, #e0f3ff)",
            }}
          >
            {/* Title Bar */}
            <div className="relative flex justify-center items-center">
              <div
                className="absolute left-0 right-0 h-[4px]"
                style={{ background: "linear-gradient(90deg, #D15D9E 38.04%, #5D4495 121.51%)" }}
              />
              <div
                className="h-[47px] w-[440px] flex items-center justify-center text-white font-medium text-md z-10"
                style={{
                  background: "linear-gradient(90deg, #D15D9E 38.04%, #5D4495 121.51%)",
                  borderRadius: "120px",
                }}
              >
                Start Your Project
              </div>
            </div>

            {/* Section Heading */}
            <div className="w-full flex flex-col gap-2 mt-2">
              <h2 className="text-[#2A428C] text-[28px] font-bold">Select a Product Type</h2>
              <hr className="border-t border-[#2A428C] w-full" />
            </div>

            {/* Product Cards */}
            <div className="w-full flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {productCards.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col items-center bg-white rounded-xl shadow-md p-4"
                    style={{ width: "200px", height: "290px", textAlign: "center", overflow: "hidden" }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-[100px] object-contain mb-2"
                    />
                    <h3 className="text-black font-semibold text-[16px] mb-1 truncate">{product.title}</h3>
                    <p
                      className="text-gray-500 text-[13px] leading-5 overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Book Details Section */}
            <hr className="border-t border-gray-300 mt-6" />

            <div className="w-full flex flex-col gap-4 mt-4">
              <h2 className="text-[#2A428C] text-[28px] font-bold">Book Details</h2>

              {/* Project Title */}
              <div className="flex flex-col">
                <label className="text-black font-semibold text-[16px] mb-1">Project Title</label>
                <textarea
                  maxLength={255}
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter project details..."
                  className="w-full border border-gray-300 rounded-md p-3 resize-none text-sm text-gray-800"
                ></textarea>
                <div className="text-right text-gray-500 text-sm mt-1">{text.length}/255</div>
              </div>

              {/* Book Language and Category */}
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-black font-semibold text-[15px] mb-1">
                    Book Language (Optional)
                  </label>
                  <select 
                    className="border border-gray-300 rounded-md p-2 text-sm"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    <option value="">Select Language</option>
                    <option value="english">English</option>
                    <option value="urdu">Urdu</option>
                    <option value="arabic">Arabic</option>
                  </select>
                </div>

                <div className="flex flex-col w-full md:w-1/2">
                  <label className="text-black font-semibold text-[15px] mb-1">Book Category</label>
                  <select
                    className="border border-gray-300 rounded-md p-2 text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {productCards.map((product) => (
                      <option key={product.id} value={product.title}>
                        {product.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Button */}
              <div className="flex justify-center mt-4">
                <button
                  className="text-white font-medium text-[16px]"
                  style={{
                    padding: "14px 204px",
                    background:
                      "linear-gradient(90deg, #0060A9 16.41%, #0080C0 38.41%, #0096CD 60.03%, #0000DC 87.93%)",
                    borderRadius: "100px",
                    textTransform: "capitalize",
                    cursor: text.trim() && selectedCategory ? "pointer" : "not-allowed",
                    opacity: text.trim() && selectedCategory ? 1 : 0.6,
                  }}
                  onClick={handleButtonClick}
                  disabled={!text.trim() || !selectedCategory}
                >
                  Design Your Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default StartProject;