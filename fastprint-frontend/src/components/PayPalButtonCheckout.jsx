import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/baseURL';

const PayPalButtonCheckout = ({
  amount,
  currency = 'USD',
  onSuccess,
  onError,
  onCancel,
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error when amount changes
  useEffect(() => {
    if (error) setError(null);
  }, [amount]);

  // Validate that amount is positive and within limit
  const validateAmount = (amount) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      return 'Please enter a valid amount greater than 0';
    }
    if (amount > 10000) {
      return 'Amount cannot exceed $10,000';
    }
    return null;
  };

  // Retrieve token or throw error if not present
  const getAuthToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Please log in to continue with payment');
    }
    return token;
  };

  // Main checkout handler
  const handlePayPalCheckout = async () => {
    const amountError = validateAmount(amount);
    if (amountError) {
      setError(amountError);
      if (onError) onError(amountError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();

      const requestData = {
        amount: parseFloat(amount).toFixed(2),
        currency: currency,
        return_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`,
      };

      // Make request to your backend to create PayPal payment
      const response = await axios.post(
        `${BASE_URL}api/paypal/create-payment/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds
        }
      );

      const { payment_id, approval_url, status } = response.data;

      if (approval_url && payment_id) {
        // Save payment_id locally to handle later (e.g. on return)
        localStorage.setItem('paypal_payment_id', payment_id);

        console.log('PayPal payment created:', {
          payment_id,
          status,
          approval_url: approval_url.substring(0, 50) + '...',
        });

        // Redirect user to PayPal to approve the payment
        window.location.href = approval_url;
      } else {
        throw new Error('Invalid response from PayPal service');
      }
    } catch (error) {
      console.error('PayPal checkout error:', error);

      let errorMessage = 'Failed to initiate PayPal checkout';

      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection and try again.';
      } else if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
          case 400:
            errorMessage = data.error || 'Invalid payment information provided';
            break;
          case 401:
            errorMessage = 'Authentication failed. Please log in again.';
            localStorage.removeItem('accessToken'); // Clear token if unauthorized
            break;
          case 403:
            errorMessage = 'Payment not authorized. Please check your account permissions.';
            break;
          case 404:
            errorMessage = 'Payment service not found. Please contact support.';
            break;
          case 503:
            errorMessage = 'PayPal service is temporarily unavailable. Please try again later.';
            break;
          case 500:
            errorMessage = 'Server error occurred. Please try again or contact support.';
            break;
          default:
            errorMessage = data.error || `Server error (${status}). Please try again.`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = disabled || isLoading || !amount || amount <= 0;

  return (
    <div className="paypal-button-container">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start">
            <svg
              className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      <button
        onClick={handlePayPalCheckout}
        disabled={isButtonDisabled}
        aria-disabled={isButtonDisabled}
        aria-busy={isLoading}
        className={`
          w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200
          ${
            isButtonDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#0070ba] hover:bg-[#005ea6] active:bg-[#004c87] shadow-md hover:shadow-lg transform hover:scale-[1.02]'
          }
        `}
        type="button"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a9.124 9.124 0 0 1-.045.289c-1.07 5.455-4.665 7.314-9.244 7.314H9.942a.641.641 0 0 0-.633.74l-.678 4.299-.191 1.207a.33.33 0 0 0 .326.384h2.292c.459 0 .85-.334.924-.788l.038-.207.73-4.625.047-.253c.074-.454.465-.788.924-.788h.582c3.729 0 6.646-1.514 7.49-5.895.354-1.837.171-3.373-.645-4.483-.302-.412-.714-.744-1.202-.99z" />
            </svg>
            <span>Pay with PayPal</span>
          </div>
        )}
      </button>

      {amount > 0 && (
        <div className="text-center text-sm text-gray-600 mt-2" aria-live="polite">
          Amount: ${parseFloat(amount).toFixed(2)} {currency}
        </div>
      )}

      {/* Debug info, visible only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mt-2" aria-live="polite">
          <details>
            <summary>Debug Info</summary>
            <div className="mt-1 p-2 bg-gray-50 rounded text-left">
              <div>Amount: {amount}</div>
              <div>Currency: {currency}</div>
              <div>Has Token: {!!localStorage.getItem('accessToken') ? 'Yes' : 'No'}</div>
              <div>Button Disabled: {isButtonDisabled.toString()}</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default PayPalButtonCheckout;
