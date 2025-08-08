import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuantityEstimateDropdown from '../components/QuantityEstimateDropdown';


import Header from '../components/Header';
import Carousel from '../components/Carousel';

// Image imports
import WireO from '../assets/images/wireo.jpg';
import PremiumColor from '../assets/images/int4.png';
import WhiteCoated from '../assets/images/pp3.jpg';
import Gloss from '../assets/images/glossy.png';
import Matte from '../assets/images/matty.png';
import RightImage from '../assets/images/right.png';
import Book1 from '../assets/images/book1.png';
import Book2 from '../assets/images/Group.png';
import PricingBanner from '../components/PricingBanner';
import Footer from '../components/Footer';
import RedirectButton from '../components/RedirectButton';
import { BASE_URL } from '../services/baseURL';

const API_BASE =`${BASE_URL}` ;
const getDiscountInfo = (qty) => {
  if (qty >= 1000) return { percent: 15, price: 17.93 };
  if (qty >= 500) return { percent: 10, price: 18.98 };
  if (qty >= 100) return { percent: 5, price: 20.04 };
  return null;
};

const imageMap = {
  'Wire O': WireO,
  'Premium Color': PremiumColor,
  '100# White-Coated': WhiteCoated,
  'Gloss': Gloss,
  'Matte': Matte,
};

const OptionField = ({ title, name, options, form, handleChange }) => (
  <fieldset>
    <legend className="font-semibold text-gray-700 mb-3">{title}</legend>
    <div className="flex flex-wrap gap-6">
      {options.map(opt => (
        <label
          key={opt.id}
          className={`cursor-pointer flex flex-col items-center w-24 p-2 border rounded transition ${
            form[name] === opt.id ? 'border-blue-600 bg-blue-100' : 'border-gray-300'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt.id}
            checked={form[name] === opt.id}
            onChange={handleChange}
            className="mb-2"
          />
          {imageMap[opt.name] && (
            <img src={imageMap[opt.name]} alt={opt.name} className="w-16 h-16 object-contain mb-1" />
          )}
          <span className="text-center text-sm">{opt.name}</span>
        </label>
      ))}
    </div>
  </fieldset>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-200 pb-1 text-gray-700">
    <span className="font-semibold">{label}</span>
    <span>{value}</span>
  </div>
);

const CalendarCalculator = () => {
  const [dropdowns, setDropdowns] = useState({});
  const [form, setForm] = useState({
    binding_id: '',
    interior_color_id: '',
    paper_type_id: '',
    cover_finish_id: '',
    quantity: 1,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

useEffect(() => {
  const url = `${API_BASE}api/calender/dropdowns/`;
  
  axios
    .get(url)
    .then(res => setDropdowns(res.data))
    .catch(() => alert('Failed to load dropdowns'))
    .finally(() => setLoading(false));
}, []);



  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) }));
    setResult(null);
  };

const handleSubmit = async e => {
  e.preventDefault();
  setCalculating(true);
  try {
    const url = `${API_BASE}api/calender/calculate/`;
    const res = await axios.post(url, form);
    setResult(res.data);
  } catch (err) {
    alert('Calculation failed');
    console.error(err);
  } finally {
    setCalculating(false);
  }
};



  const getNameById = (list, id) => list?.find(opt => opt.id === id)?.name || '-';

  const bindings = dropdowns.bindings || [];
  const interiorColors = dropdowns.interior_colors || [];
  const paperTypes = dropdowns.paper_types || [];
  const coverFinishes = dropdowns.cover_finishes || [];

  return (
    <>
      <Header />

   <PricingBanner/>

      <div className="relative z-0">
        <Carousel />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

          {loading ? (
            <p className="text-blue-700">Loading options...</p>
          ) : (
            <div className="flex w-full max-w-6xl gap-8">
              <form onSubmit={handleSubmit} className="flex-1 bg-white p-8 rounded-lg shadow-lg flex flex-col gap-6">
                <OptionField
                  title="Binding Type"
                  name="binding_id"
                  options={bindings}
                  form={form}
                  handleChange={handleChange}
                />
                <OptionField
                  title="Interior Color"
                  name="interior_color_id"
                  options={interiorColors}
                  form={form}
                  handleChange={handleChange}
                />
                <OptionField
                  title="Paper Type"
                  name="paper_type_id"
                  options={paperTypes}
                  form={form}
                  handleChange={handleChange}
                />
                <OptionField
                  title="Cover Finish"
                  name="cover_finish_id"
                  options={coverFinishes}
                  form={form}
                  handleChange={handleChange}
                />

               <QuantityEstimateDropdown
  form={form}
  handleChange={handleChange}
  handleSubmit={handleSubmit}
  result={result}
  getDiscountInfo={getDiscountInfo}
  calculating={calculating}
  loading={loading}
/>

              </form>

              <aside className="w-96 bg-white rounded-lg shadow-lg p-6 flex flex-col">
                <img src={RightImage} alt="Calendar" className="w-full h-48 object-cover rounded mb-6" />
                <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">Custom Calendar Printing</h2>
                <div className="space-y-4 flex-grow">
                  <InfoRow label="Binding Type" value={getNameById(bindings, form.binding_id)} />
                  <InfoRow label="Interior Color" value={getNameById(interiorColors, form.interior_color_id)} />
                  <InfoRow label="Paper Type" value={getNameById(paperTypes, form.paper_type_id)} />
                  <InfoRow label="Cover Finish" value={getNameById(coverFinishes, form.cover_finish_id)} />
                  <InfoRow label="Quantity" value={form.quantity} />
                  <RedirectButton/>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CalendarCalculator;
 