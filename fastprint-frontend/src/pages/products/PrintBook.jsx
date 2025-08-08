import { BASE_URL } from "../../services/baseURL";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = '${BASE_URL}'; // ✅ your Django backend URL

const PrintBookCalculator = () => {
  const [dropdowns, setDropdowns] = useState({});
  const [bindings, setBindings] = useState([]);
  const [form, setForm] = useState({
    trim_size_id: '',
    page_count: '',
    binding_id: '',
    interior_color_id: '',
    paper_type_id: '',
    cover_finish_id: '',
    quantity: 1,
  });
  const [result, setResult] = useState(null);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [loadingBindings, setLoadingBindings] = useState(false);
  const [calculating, setCalculating] = useState(false);

  // ✅ Fetch all dropdown options from backend
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/calculator/dropdowns/`);
        console.log("✅ Dropdowns:", res.data);
        setDropdowns(res.data);
      } catch (err) {
        console.error("❌ Dropdown Fetch Error:", err);
        alert("Failed to load dropdowns.");
      } finally {
        setLoadingDropdowns(false);
      }
    };
    fetchDropdowns();
  }, []);

  // ✅ Fetch bindings based on trim size + page count
  useEffect(() => {
    const fetchBindings = async () => {
      if (form.trim_size_id && form.page_count) {
        try {
          setLoadingBindings(true);
          const res = await axios.get(`${API_BASE}/api/calculator/bindings/`, {
            params: {
              trim_size_id: form.trim_size_id,
              page_count: form.page_count,
            },
          });
          console.log("✅ Bindings:", res.data);
          setBindings(res.data);
        } catch (err) {
          console.error("❌ Bindings Fetch Error:", err);
          alert("Failed to load binding options.");
        } finally {
          setLoadingBindings(false);
        }
      } else {
        setBindings([]);
      }
    };
    fetchBindings();
  }, [form.trim_size_id, form.page_count]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCalculating(true);
      const res = await axios.post(`${API_BASE}/api/calculator/calculate/`, form);
      console.log("✅ Cost Result:", res.data);
      setResult(res.data);
    } catch (err) {
      console.error("❌ Calculation Error:", err);
      alert("Error calculating cost.");
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">📘 Print Book Calculator</h2>

      {loadingDropdowns ? (
        <p className="text-center text-blue-600">Loading dropdowns...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectInput
            label="Trim Size"
            name="trim_size_id"
            value={form.trim_size_id}
            options={dropdowns.trim_sizes || []}
            onChange={handleChange}
          />

          <InputField
            label="Page Count"
            name="page_count"
            value={form.page_count}
            onChange={handleChange}
            type="number"
          />

          {loadingBindings ? (
            <p>Loading bindings...</p>
          ) : (
            <SelectInput
              label="Binding Type"
              name="binding_id"
              value={form.binding_id}
              options={bindings}
              onChange={handleChange}
            />
          )}

          <SelectInput
            label="Interior Color"
            name="interior_color_id"
            value={form.interior_color_id}
            options={dropdowns.interior_colors || []}
            onChange={handleChange}
          />

          <SelectInput
            label="Paper Type"
            name="paper_type_id"
            value={form.paper_type_id}
            options={dropdowns.paper_types || []}
            onChange={handleChange}
          />

          <SelectInput
            label="Cover Finish"
            name="cover_finish_id"
            value={form.cover_finish_id}
            options={dropdowns.cover_finishes || []}
            onChange={handleChange}
          />

          <InputField
            label="Quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            type="number"
          />

          <button
            type="submit"
            disabled={calculating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
          >
            {calculating ? 'Calculating...' : 'Calculate'}
          </button>
        </form>
      )}

      {result && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold text-blue-700">💰 Result</h3>
          <p><strong>Cost per Book:</strong> ${Number(result.cost_per_book).toFixed(2)}</p>
          <p><strong>Total Cost:</strong> ${Number(result.total_cost).toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

const SelectInput = ({ label, name, value, options = [], onChange }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border px-3 py-2 rounded"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </select>
  </div>
);

const InputField = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label className="block font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border px-3 py-2 rounded"
    />
  </div>
);

export default PrintBookCalculator;
