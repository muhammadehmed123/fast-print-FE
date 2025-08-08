import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QuantityEstimateDropdown from '../components/QuantityEstimateDropdown';

import PerfectBoundImg from '../assets/images/perfectbound.png';
import Book1 from '../assets/images/book1.png';
import Book2 from '../assets/images/Group.png';
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

const OptionField = ({ title, name, options, images, form, handleChange }) => {
  // Remove duplicates based on option name
  const uniqueOptions = Array.from(
    new Map(options.map(opt => [opt.name, opt])).values()
  );

  const handleOptionClick = (optionId) => {
    // Create a synthetic event object
    const syntheticEvent = {
      target: {
        name: name,
        value: optionId,
        type: 'radio'
      }
    };
    handleChange(syntheticEvent);
  };

  return (
    <fieldset>
      <legend className="font-semibold text-gray-700 mb-3">{title}</legend>
      <div className="flex flex-wrap gap-6">
        {uniqueOptions.map(opt => (
          <label
            key={opt.id}
            className={`cursor-pointer flex flex-col items-center w-24 p-2 border-2 rounded transition-all duration-200 ${
              form[name] === opt.id 
                ? 'border-blue-600 bg-blue-50 shadow-md' 
                : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
            }`}
            onClick={() => handleOptionClick(opt.id)}
          >
            <input
              type="radio"
              name={name}
              value={opt.id}
              checked={form[name] === opt.id}
              onChange={() => {}} // Controlled by label click
              className="mb-2 accent-blue-600"
              style={{ display: 'none' }} // Hide the default radio button
            />
            {/* Custom radio button indicator */}
            <div className={`w-4 h-4 rounded-full border-2 mb-2 flex items-center justify-center ${
              form[name] === opt.id 
                ? 'border-blue-600 bg-blue-600' 
                : 'border-gray-400'
            }`}>
              {form[name] === opt.id && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            {images[opt.name] && (
              <img src={images[opt.name]} alt={opt.name} className="w-16 h-16 object-contain mb-1" />
            )}
            <span className={`text-center text-sm ${
              form[name] === opt.id ? 'text-blue-700 font-semibold' : 'text-gray-700'
            }`}>
              {opt.name}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className="text-gray-600 font-medium">{value}</span>
  </div>
);

const PhotoBookCalculator = () => {
  const [dropdowns, setDropdowns] = useState({});
  const [form, setForm] = useState({
    trim_size_id: '',
    page_count: '',
    binding_id: '',
    interior_color_id: '',
    paper_type_id: '',
    cover_finish_id: '',
    spine_id: '',
    exterior_color_id: '',
    foil_stamping_id: '',
    screen_stamping_id: '',
    quantity: 1,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const res = await axios.get(`${API_BASE}api/photobook/dropdowns/`);
        setDropdowns(res.data);
        console.log('Dropdowns loaded:', res.data); // Debug log
      } catch (err) {
        alert("Failed to load dropdowns.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDropdowns();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = value;
    
    // Convert to number for specific fields that expect numeric IDs
    if (type === 'number') {
      val = value === '' ? '' : Number(value);
    } else if (name.includes('_id') && value !== '') {
      // Convert ID fields to numbers to match the dropdown option IDs
      val = Number(value);
    }
    
    console.log(`Updating ${name} to:`, val, 'Type:', typeof val); // Debug log
    
    setForm(prev => {
      const newForm = { ...prev, [name]: val };
      console.log('New form state:', newForm); // Debug log
      return newForm;
    });
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCalculating(true);
      const res = await axios.post(`${API_BASE}api/photobook/calculate/`, form);
      setResult(res.data);
    } catch (err) {
      alert("Calculation failed.");
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  const getNameById = (list, id) => {
    if (!list || !id) return '-';
    const found = list.find(opt => opt.id === id);
    return found ? found.name : '-';
  };

  const bindingImages = {
    "Perfect Bound": PerfectBoundImg,
    "Coil Bound": CoilBoundImg,
    "Saddle Stitch": SaddleImg,
    "Case Wrap": CaseWrap,
    "Linen Wrap": LinenWrap,
  };
  const interiorColorImages = {
    "Standard Black & White": StandardBlackandWhite,
    "Premium Black & White": PremiumBlackandWhite,
    "Standard Color": StandardColor,
    "Premium Color": PremiumColor,
  };
  const paperTypeImages = {
    "60# Cream-Uncoated": Creamuncoated,
    "60# White-Uncoated": Whiteuncoated,
    "80# White-Coated": Whitecoated,
    "100# White-Coated": Whitecoatedd,
  };
  const coverFinishImages = {
    "Gloss": Glossy,
    "Matte": Matty,
  };

  const interiorColors = dropdowns.interior_colors || [];
  const paperTypes = dropdowns.paper_types || [];
  const coverFinishes = dropdowns.cover_finishes || [];
  const trimSizes = dropdowns.trim_sizes || [];
  const bindings = dropdowns.bindings || [];

  return (
    <>
      <Header />
      <PricingBanner />
      <Carousel />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-blue-700 text-lg">Loading options...</div>
          </div>
        ) : (
          <div className="flex w-full max-w-6xl gap-8">
            <form onSubmit={handleSubmit} className="flex-1 bg-white p-8 rounded-lg shadow-lg flex flex-col gap-6">
              <div className="flex flex-col gap-4 px-4 py-4 mb-8" style={{ background: 'linear-gradient(90deg, #016AB3 16.41%, #0096CD 60.03%, #00AEDC 87.93%)', border: '1px solid #E5E5E5', borderRadius: '20px' }}>
                <h3 style={{ color: 'white' }} className="text-lg font-semibold">Book Size & Page Count</h3>
                <div className="flex gap-4 items-end">
                  <div className="w-1/2">
                    <label className="text-sm text-white mb-1 block">Trim Size</label>
                    <select 
                      name="trim_size_id" 
                      value={form.trim_size_id} 
                      onChange={handleChange} 
                      className="w-full border border-gray-300 rounded p-2 h-12" 
                      style={{ backgroundColor: 'white' }} 
                      required
                    >
                      <option value="">Select Trim Size</option>
                      {trimSizes.map((ts) => (
                        <option key={ts.id} value={ts.id}>{ts.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="text-sm text-white mb-1 block">Page Count (max 200)</label>
                    <input 
                      type="number" 
                      name="page_count" 
                      value={form.page_count} 
                      onChange={handleChange} 
                      min="1" 
                      max="200" 
                      className="w-full border border-gray-300 rounded p-2 h-12" 
                      style={{ backgroundColor: 'white' }} 
                      placeholder="Enter Page Count" 
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <OptionField 
                title="Binding Type" 
                name="binding_id" 
                options={bindings} 
                images={bindingImages} 
                form={form} 
                handleChange={handleChange} 
              />
              
              <OptionField 
                title="Interior Color" 
                name="interior_color_id" 
                options={interiorColors} 
                images={interiorColorImages} 
                form={form} 
                handleChange={handleChange} 
              />
              
              <OptionField 
                title="Paper Type" 
                name="paper_type_id" 
                options={paperTypes} 
                images={paperTypeImages} 
                form={form} 
                handleChange={handleChange} 
              />
              
              <OptionField 
                title="Cover Finish" 
                name="cover_finish_id" 
                options={coverFinishes} 
                images={coverFinishImages} 
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
              <img src={RightImage} alt="Book" className="w-full h-48 object-cover rounded mb-6" />
              <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">High-Quality Photo Printing</h2>
              
              <div className="space-y-3 flex-grow">
                <InfoRow label="Trim Size" value={getNameById(trimSizes, form.trim_size_id)} />
                <InfoRow label="Page Count" value={form.page_count || '-'} />
                <InfoRow label="Binding Type" value={getNameById(bindings, form.binding_id)} />
                <InfoRow label="Interior Color" value={getNameById(interiorColors, form.interior_color_id)} />
                <InfoRow label="Paper Type" value={getNameById(paperTypes, form.paper_type_id)} />
                <InfoRow label="Cover Finish" value={getNameById(coverFinishes, form.cover_finish_id)} />
                <InfoRow label="Quantity" value={form.quantity || '-'} />
                
                <div className="pt-4 border-t border-gray-200">
                  <RedirectButton />
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PhotoBookCalculator;