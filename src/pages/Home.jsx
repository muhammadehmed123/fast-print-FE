import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {
  const navigate = useNavigate();

  const handleQuoteClick = () => {
    navigate('/calculator/printbook');
  };

  return (
    <div className="home-page">
      <Header />

      {/* Main Hero Section */}
      <div className="relative w-full min-h-screen bg-[#101D2E] overflow-hidden">
        
        {/* Floating Animation Styles */}
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }

          .float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>

        {/* Decorative Background Images */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://fastprintguys.com/wp-content/uploads/2025/06/Group.png"
            alt=""
            width="186"
            height="124"
            className="absolute top-[5%] left-[2%] float"
          />

          <img
            src="https://fastprintguys.com/wp-content/uploads/2025/06/Vector-1.png"
            alt=""
            width="166"
            height="101"
            className="absolute bottom-[8%] right-[3%] float"
          />

          <img
            src="https://fastprintguys.com/wp-content/uploads/2025/06/image-309.png"
            alt=""
            width="232"
            height="302"
            className="absolute top-[12%] right-[10%] float"
          />

          <img
            src="https://fastprintguys.com/wp-content/uploads/2025/06/Group-1261153638.png"
            alt=""
            width="179"
            height="175"
            className="absolute bottom-[15%] left-[8%] float"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center px-4 min-h-screen">
          <h1
            className="text-[50px] font-bold mb-2"
            style={{
              fontFamily: "'Lobster', cursive",
              fontSize: '50px',
              fontWeight: '700',
              color: '#f8c20a',
            }}
          >
            Fast changing Guys:
          </h1>

          <h2
            className="text-[50px] leading-[60px] font-bold mb-4"
            style={{
              fontFamily: '"Plus Jakarta Sans New Font", Sans-serif',
              color: '#FFFFFF',
            }}
          >
            Unbeatable Premium Printing<br />Service Speed &amp; Quality
          </h2>

          <p className="text-white text-lg max-w-2xl mb-6">
            Fast, affordable, and reliable printing services – no hidden fees, no quality compromise.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button
              onClick={handleQuoteClick}
              className="px-6 py-3 text-white rounded-full text-sm font-medium border border-transparent transition-all duration-300 hover:bg-transparent hover:border-[#f8c20a] cursor-pointer"
              style={{
                backgroundColor: '#F8C20A',
                fontFamily: '"Plus Jakarta Sans New Font", Sans-serif',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              Get an Instant Quote Now please chl ja 
            </button>

            <h3
              className="text-[20px] font-bold leading-[26px] text-center md:text-left"
              style={{
                fontFamily: "'Lobster', cursive",
                color: '#f8c20a',
              }}
            >
              Start Your Order – 10%<br />Off First Print!
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
