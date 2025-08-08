import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QuantityEstimateDropdown from '../components/QuantityEstimateDropdown';

import PerfectBoundImg from '../assets/images/perfectbound.png';
import CoilBoundImg from '../assets/images/coilbound.png';
import SaddleImg from '../assets/images/saddle.png';
import CaseWrap from '../assets/images/casewrap.png';
import LinenWrap from '../assets/images/linenwrap.png';
import StandardBlackandWhite from '../assets/images/int1.png';
import PremiumBlackandWhite from '../assets/images/in2.png';
import StandardColor from '../assets/images/in3.png';
import PremiumColor from '../assets/images/int4.png';
import Creamuncoated from '../assets/images/pp1.jpg';
import Whiteuncoated from '../assets/images/pp2.jpg';
import Whitecoated from '../assets/images/pp3.jpg';
import Whitecoatedd from '../assets/images/pp4.jpg';
import Glossy from '../assets/images/glossy.png';
import Matty from '../assets/images/matty.png';
import RightImage from '../assets/images/right.png';

import Header from '../components/Header';
import Carousel from '../components/Carousel';
import PricingBanner from '../components/PricingBanner';
import Footer from '../components/Footer';
import RedirectButton from '../components/RedirectButton';
import { BASE_URL } from '../services/baseURL';

const API_BASE = `${BASE_URL}`;
const getDiscountInfo = (qty) => {
  if (qty >= 1000) return { percent: 15, price: 17.93 };
  if (qty >= 500) return { percent: 10, price: 18.98 };
  if (qty >= 100) return { percent: 5, price: 20.04 };
  return null;
};

const OptionField = ({ title, name, options, images, form, handleChange }) => (
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
          {images[opt.name] && (
            <img src={images[opt.name]} alt={opt.name} className="w-16 h-16 object-contain mb-1" />
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

const YearBookCalculator = () => {
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
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [allBindings, setAllBindings] = useState([
    { id: 1, name: 'Perfect Bound' },
    { id: 2, name: 'Coil Bound' },
    { id: 3, name: 'Saddle Stitch' },
    { id: 4, name: 'Case Wrap' },
    { id: 5, name: 'Linen Wrap' },
  ]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
const safeURL = `${API_BASE}api/yearbook/dropdowns/`.replace(/([^:]\/)\/+/g, "$1");
const res = await axios.get(safeURL);
        setDropdowns(res.data);
      } catch (err) {
        alert("Failed to load dropdowns.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDropdowns();
  }, []);

useEffect(() => {
  const { trim_size_id, page_count } = form;
  if (trim_size_id && page_count) {
    const safeURL = `${API_BASE}api/yearbook/bindings/`.replace(/([^:]\/)\/+/g, "$1");
    axios.get(safeURL, { params: { trim_size_id, page_count } })
      .then(res => setBindings(res.data))
      .catch(() => alert("Failed to load bindings."));
  } else {
    setBindings([]);
  }
}, [form.trim_size_id, form.page_count]);


  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = value;
    if (
      type === 'number' ||
      ['trim_size_id', 'binding_id', 'interior_color_id', 'paper_type_id', 'cover_finish_id'].includes(name)
    ) {
      val = value === '' ? '' : Number(value);
    }
    setForm(prev => ({ ...prev, [name]: val }));
    setResult(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setCalculating(true);
  try {
    const safeURL = `${API_BASE}api/yearbook/calculate/`.replace(/([^:]\/)\/+/g, "$1");
    const res = await axios.post(safeURL, form);
    setResult(res.data);
  } catch (err) {
    alert("Calculation failed.");
    console.error(err);
  } finally {
    setCalculating(false);
  }
};


  const getNameById = (list, id) => list?.find(opt => opt.id === id)?.name || '-';

  const bindingImages = {
    "Perfect Bound": PerfectBoundImg,
    "Coil Bound": CoilBoundImg,
    "Saddle Stitch": SaddleImg,
    "Case Wrap": CaseWrap,
    "Linen Wrap": LinenWrap,
  };

  // Updated interior color images mapping with all possible variations
  const interiorColorImages = {
    "Standard Black & White": StandardBlackandWhite,
    "Standard Black and White": StandardBlackandWhite,
    "Premium Black & White": PremiumBlackandWhite,
    "Premium Black and White": PremiumBlackandWhite,
    "Premium Black & white": PremiumBlackandWhite, // Fixed case variation
    "Premium Black and white": PremiumBlackandWhite,
    "Standard Color": StandardColor,
    "Premium Color": PremiumColor,
  };

  // Updated paper type images mapping with all possible variations
  const paperTypeImages = {
    "60# Cream-Uncoated": Creamuncoated,
    
    "60# White-uncoated": Whiteuncoated,
 
    "70# White-Uncoated": Whitecoatedd, // Using same image for 70# as 60#
   
    "80# White-Coated": Whitecoated,
    "80# White Coated": Whitecoated,
    "100# White-Coated": Whitecoatedd,
    "100# White Coated": Whitecoatedd,
  };

  const coverFinishImages = {
    "Gloss": Glossy,
    "Glossy": Glossy,
    "Matte": Matty,
    "Matt": Matty,
    "Matty": Matty,
  };

  const interiorColors = dropdowns.interior_colors || [];
  const paperTypes = dropdowns.paper_types || [];
  const coverFinishes = dropdowns.cover_finishes || [];
  const trimSizes = dropdowns.trim_sizes || [];

  return (
    <>
      <Header />
      <PricingBanner/>
      <Carousel />

      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
        <div className="flex w-full max-w-6xl gap-8">
          <form onSubmit={handleSubmit} className="flex-1 bg-white p-8 rounded-lg shadow-lg flex flex-col gap-6">

            {/* Book Size & Page Count */}
            <div className="flex flex-col gap-4 px-4 py-4 mb-8" style={{ background: 'linear-gradient(90deg, #016AB3 16.41%, #0096CD 60.03%, #00AEDC 87.93%)', border: '1px solid #E5E5E5', borderRadius: '20px' }}>
              <h3 style={{ color: 'white' }} className="text-lg font-semibold">Book Size & Page Count</h3>
              <div className="flex gap-4 items-end">
                <div className="w-1/2">
                  <label className="text-sm text-white mb-1 block">Trim Size</label>
                  <select name="trim_size_id" value={form.trim_size_id} onChange={handleChange} required className="w-full border rounded p-2 h-12 bg-white">
                    <option value="">Select Book Size</option>
                    {trimSizes.map(ts => <option key={ts.id} value={ts.id}>{ts.name}</option>)}
                  </select>
                </div>
                <div className="w-1/2">
                  <p className="text-xs text-white mb-1 opacity-90">Maximum page count is 200</p>
                  <input
                    type="number"
                    name="page_count"
                    value={form.page_count}
                    onChange={(e) => {
                      let val = e.target.value;
                      if (val === '') {
                        handleChange(e);
                        return;
                      }
                      const numVal = Number(val);
                      if (numVal > 200) {
                        e.target.value = '200';
                        handleChange({ ...e, target: { ...e.target, value: '200' } });
                      } else if (numVal < 1) {
                        e.target.value = '1';
                        handleChange({ ...e, target: { ...e.target, value: '1' } });
                      } else {
                        handleChange(e);
                      }
                    }}
                    min="1"
                    max="200"
                    className="w-full border rounded p-2 h-12 bg-white"
                    placeholder="Enter Page Count"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Binding Types */}
            <fieldset>
              <legend className="font-semibold text-gray-700 mb-3">Binding Type</legend>
              <div className="flex flex-wrap gap-6">
                {allBindings.map(binding => {
                  const isAvailable = bindings.some(b => b.name === binding.name);
                  const bindingData = bindings.find(b => b.name === binding.name);
                  const bindingId = bindingData?.id || binding.id;
                  return (
                    <label key={binding.name} className={`cursor-pointer flex flex-col items-center w-24 p-2 border rounded transition ${form.binding_id === bindingId ? 'border-blue-600 bg-blue-100' : 'border-gray-300'} ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <input type="radio" name="binding_id" value={bindingId} disabled={!isAvailable} checked={form.binding_id === bindingId} onChange={handleChange} className="mb-2" />
                      <img src={bindingImages[binding.name]} alt={binding.name} className="w-16 h-16 object-contain mb-1" />
                      <span className="text-center text-sm">{binding.name}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <OptionField title="Interior Color" name="interior_color_id" options={interiorColors} images={interiorColorImages} form={form} handleChange={handleChange} />
            <OptionField title="Paper Type" name="paper_type_id" options={paperTypes} images={paperTypeImages} form={form} handleChange={handleChange} />
            <OptionField title="Cover Finish" name="cover_finish_id" options={coverFinishes} images={coverFinishImages} form={form} handleChange={handleChange} />

            <QuantityEstimateDropdown
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              result={result}
              getDiscountInfo={getDiscountInfo}
              calculating={calculating}
              loading={false}
            />

          </form>

          {/* Summary */}
          <aside className="w-96 bg-white rounded-lg shadow-lg p-6 flex flex-col">
            <img src={RightImage} alt="Book" className="w-full h-48 object-cover rounded mb-6" />
            <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">Custom Yearbook Printing</h2>
            <div className="space-y-4 flex-grow">
              <InfoRow label="Trim Size" value={getNameById(trimSizes, form.trim_size_id)} />
              <InfoRow label="Page Count" value={form.page_count || '-'} />
              <InfoRow label="Binding Type" value={getNameById(bindings, form.binding_id)} />
              <InfoRow label="Interior Color" value={getNameById(interiorColors, form.interior_color_id)} />
              <InfoRow label="Paper Type" value={getNameById(paperTypes, form.paper_type_id)} />
              <InfoRow label="Cover Finish" value={getNameById(coverFinishes, form.cover_finish_id)} />
              <InfoRow label="Quantity" value={form.quantity} />
              <RedirectButton/>
            </div>
          </aside>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default YearBookCalculator;