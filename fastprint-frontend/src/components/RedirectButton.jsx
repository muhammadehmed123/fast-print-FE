import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // Adjust path as needed

const RedirectButton = ({
  text = "Create Your Print Book",
  width = "500px",
  height = "44px",
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      navigate('/userdashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={handleClick}
        className="flex justify-center items-center px-[24px] py-[12px] text-white text-[16px] font-medium rounded-full"
        style={{
          background: 'linear-gradient(29.94deg, #016AB3 -87.29%, #0096CD 29.75%, #00AEDC 104.58%)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          width,
          height,
        }}
      >
        {text}
      </button>
    </div>
  );
};

export default RedirectButton;
