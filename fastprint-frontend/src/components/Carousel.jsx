import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import ComicBook from '../assets/images/comic.png';
import ThesisBook from '../assets/images/thesis.png';
import YearBook from '../assets/images/yearbook.png';
import Calendar from '../assets/images/calender.png';
import Magazine from '../assets/images/magzene.png';
import PrintBook from '../assets/images/pnew.png';
import PhotoBook from '../assets/images/myphoto.png';

// Import your page components (these will be rendered via React Router, not directly here)
// import ComicBookCalculator from '../pages/ComicBookCalculator';
// import PricingCalculator from '../pages/PricingCalculator';
// import YearBookCalculator from '../pages/YearBookCalculator';
// import CalendarCalculator from '../pages/CalenderCalculator';
// import MagazineCalculator from '../pages/MagazineCalculator';

const carouselData = [
  { name: 'Print Book', image: PrintBook, link: '/calculator/printbook' }, // No navigation
  { name: 'Comic Book', image: ComicBook, link: '/calculator/comicbook' },
  { name: 'Thesis Binding', image: ThesisBook, link: '/pricing-calculator' },
  { name: 'Year Book', image: YearBook, link: '/calculator/yearbook' },
  { name: 'Calendar', image: Calendar, link: '/calculator/calender' },
  { name: 'Magazine', image: Magazine, link: '/calculator/magazine' },
  { name: 'Photo Book', image: PhotoBook, link: '/calculator/photobook' }, // Navigates to a new page
];

const Carousel = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const [isScrolling, setIsScrolling] = useState(false);
  // Keep selectedIndex if you want the visual ring on click before navigating
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Duplicate data for infinite scroll effect
  const infiniteData = [...carouselData, ...carouselData, ...carouselData];

  useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = 200 + 20; // card width + gap
      scrollRef.current.scrollLeft = cardWidth * carouselData.length;
    }
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current || isScrolling) return;

    const container = scrollRef.current;
    const cardWidth = 200 + 20;
    const totalOriginalWidth = cardWidth * carouselData.length;

    if (container.scrollLeft <= 0) {
      container.scrollLeft = totalOriginalWidth;
    } else if (container.scrollLeft >= totalOriginalWidth * 2) {
      container.scrollLeft = totalOriginalWidth;
    }
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    setIsScrolling(true);
    const cardWidth = 200 + 20;
    if (direction === 'left') {
      scrollRef.current.scrollLeft -= cardWidth * 2;
    } else {
      scrollRef.current.scrollLeft += cardWidth * 2;
    }

    setTimeout(() => {
      setIsScrolling(false);
      handleScroll();
    }, 300);
  };

  return (
    <section className="relative mt-10 px-4 w-[90%] max-w-[1200px] mx-auto overflow-hidden">
      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="flex gap-[20px] overflow-x-auto scroll-smooth py-3"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
        }}
      >
        {infiniteData.map((item, idx) => {
          const originalIndex = idx % carouselData.length;

          return (
            <div
              key={idx}
              onClick={() => {
                // If the item has a link, navigate to that link
                if (item.link) {
                  navigate(item.link);
                } else {
                  // If no link, it means this item is not meant to navigate.
                  // You can set selectedIndex for a visual effect, or do nothing.
                  setSelectedIndex(originalIndex); // This will still apply the ring
                }
              }}
              // Apply cursor-pointer only if the item has a link
              className={`min-w-[200px] max-w-[200px] h-[160px] flex flex-col items-center justify-between bg-white rounded-xl shadow-md p-3 transition-all duration-300 ${
                item.link ? 'cursor-pointer' : '' // Only show pointer if clickable
              } ${
                selectedIndex === originalIndex && item.link ? 'ring-4 ring-blue-500' : '' // Apply ring only if selected and linked
              } hover:shadow-lg`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-[70px] object-contain mb-2"
              />
              <p className="text-center font-semibold text-xs text-gray-800 mb-2">
                {item.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center"
        style={{
          width: '28px',
          height: '32px',
          background:
            'linear-gradient(90deg, #016AB3 16.41%, #0096CD 60.03%, #00AEDC 87.93%)',
          border: '2px solid #FFFFFF',
          boxShadow: '-8px 9px 20px rgba(0, 0, 0, 0.07)',
          borderRadius: '50%',
        }}
      >
        <FiChevronLeft className="text-white text-lg" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center"
        style={{
          width: '28px',
          height: '32px',
          background:
            'linear-gradient(90deg, #016AB3 16.41%, #0096CD 60.03%, #00AEDC 87.93%)',
          border: '2px solid #FFFFFF',
          boxShadow: '-8px 9px 20px rgba(0, 0, 0, 0.07)',
          borderRadius: '50%',
        }}
      >
        <FiChevronRight className="text-white text-lg" />
      </button>

      {/* This section is removed as navigation happens to new pages */}
      {/*
      <div className="mt-8">
        <p className="text-center text-gray-600">
          Select a book type to navigate to its calculator page.
        </p>
      </div>
      */}

      {/* Hide scrollbar for WebKit browsers */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Carousel;
