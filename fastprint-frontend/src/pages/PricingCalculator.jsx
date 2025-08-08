import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/baseURL';

const PricingCalculator = () => {
  const [options, setOptions] = useState({});
  const [formData, setFormData] = useState({
    binding_price: '',
    spine_price: '',
    exterior_color_price: '',
    foil_stamping_price: '',
    screen_stamping_price: '',
    corner_protector_price: '',
    interior_color_price_per_page: '',
    paper_type_price_per_page: '',
    page_count: '',
    quantity: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${BASE_URL}api/pricing/options/`)
      .then(res => setOptions(res.data))
      .catch(err => console.error('Error loading options', err));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(`${BASE_URL}api/pricing/calculate/`, formData);
      setResult(res.data);
    } catch (err) {
      console.error('Error calculating price', err);
      alert('Error calculating price. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

const renderSelect = (label, name, dataKey) => (
  <div className="w-full md:w-1/2 px-2 mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      onChange={handleChange}
      value={formData[name]}
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Select {label}</option>
      {(options[dataKey] ?? []).map(opt => {
        const price = opt.price !== undefined ? opt.price : opt.price_per_page !== undefined ? opt.price_per_page : 0;
        return (
          <option key={opt.id} value={price}>
            {opt.name} - ${parseFloat(price).toFixed(2)}
          </option>
        );
      })}
    </select>
  </div>
);


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-xl mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Thesis Print Pricing Calculator</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-2">
          {renderSelect('Binding Type', 'binding_price', 'binding_types')}
          {renderSelect('Spine Type', 'spine_price', 'spine_types')}
          {renderSelect('Exterior Color', 'exterior_color_price', 'exterior_colors')}
          {renderSelect('Foil Stamping', 'foil_stamping_price', 'foil_stampings')}
          {renderSelect('Screen Stamping', 'screen_stamping_price', 'screen_stampings')}
          {renderSelect('Corner Protector', 'corner_protector_price', 'corner_protectors')}
          {renderSelect('Interior Color', 'interior_color_price_per_page', 'interior_colors')}
          {renderSelect('Paper Type', 'paper_type_price_per_page', 'paper_types')}

          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Count</label>
            <input
              type="number"
              name="page_count"
              value={formData.page_count}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={1}
              max={800}
              required
            />
          </div>

          <div className="w-full md:w-1/2 px-2 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={1}
              required
            />
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300"
            disabled={loading}
          >
            {loading ? 'Calculating...' : 'Calculate Price'}
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-green-50 border-l-4 border-green-400 rounded shadow">
          <h3 className="text-xl font-bold mb-3 text-green-800">📦 Price Breakdown</h3>
          <ul className="text-gray-800 space-y-1">
            <li><strong>Cost per Book:</strong> ${result.cost_per_book}</li>
            <li><strong>Total Cost:</strong> ${result.total_cost}</li>
            <li><strong>Discount:</strong> ${result.discounted_amount}</li>
            <li><strong>Amount After Discount:</strong> ${result.amount_after_discount}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PricingCalculator;
