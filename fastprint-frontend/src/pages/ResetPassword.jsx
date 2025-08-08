import React, { useState } from 'react';
import { requestReset } from '../services/authService';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      await requestReset({ email });
      setMessage('Reset link sent to your email');
    } catch {
      setMessage('Error sending reset link');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border"
      />
      <button onClick={handleReset} className="bg-blue-600 text-white mt-4 px-4 py-2">
        Send Reset Link
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ResetPassword;
