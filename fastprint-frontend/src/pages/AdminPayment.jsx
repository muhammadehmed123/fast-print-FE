import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/baseURL';

const AdminPayment = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}api/payment/admin-payments/`)
      .then(res => setPayments(res.data))
      .catch(err => console.error('Failed to fetch payments:', err));
  }, []);

  return (
    <div className="p-10 font-sans">
      <h1 className="text-2xl font-bold mb-6">Admin Payment Page</h1>

      {payments.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table className="w-full border border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Session ID</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Currency</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.stripe_session_id}>
                <td className="p-2 border">{payment.stripe_session_id}</td>
                <td className="p-2 border">{payment.customer_email}</td>
                <td className="p-2 border">${(payment.amount / 100).toFixed(2)}</td>
                <td className="p-2 border">{payment.currency.toUpperCase()}</td>
                <td className="p-2 border">{payment.payment_status}</td>
                <td className="p-2 border">{new Date(payment.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPayment;
