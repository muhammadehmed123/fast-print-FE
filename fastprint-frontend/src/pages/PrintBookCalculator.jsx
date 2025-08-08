import React, { useEffect, useState } from 'react';
import BulkDiscountTable from '../components/BulkDiscountTable'; // Adjust path if needed

import QuantityEstimateDropdown from '../components/QuantityEstimateDropdown';

import Header from '../components/Header';
import axios from 'axios';
import Book1 from '../assets/images/book1.png';
import Book2 from '../assets/images/Group.png';
import Carousel from '../components/Carousel';
import PerfectBoundImg from '../assets/images/perfectbound.png';
import CoilBoundImg from '../assets/images/coill.jpg';
import SaddleImg from '../assets/images/saddlee.jpg';
import CaseWrap from '../assets/images/paperbackk.jpg';
import LinenWrap from '../assets/images/linenn.jpg';
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
import RedirectButton from '../components/RedirectButton';
import Footer from '../components/Footer';
import { BASE_URL } from '../services/baseURL';

const API_BASE = `${BASE_URL}`;

// Helper to get discount info for a given quantity
const getDiscountInfo = (qty) => {
  if (qty >= 1000) return { percent: 15, price: 17.93 };
  if (qty >= 500) return { percent: 10, price: 18.98 };
  if (qty >= 100) return { percent: 5, price: 20.04 };
  return null;
};

const PrintBookCalculator = () => {
  const [dropdowns, setDropdowns] = useState({});
  const [availableOptions, setAvailableOptions] = useState({
    bindings: [],
    interior_colors: [],
    paper_types: [],
    cover_finishes: []
  });
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
  const [loadingAvailableOptions, setLoadingAvailableOptions] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const filtersShouldBeActive = form.trim_size_id !== '' && form.page_count !== '';

  // Fetch dropdown options
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const res = await axios.get(`${API_BASE}api/calculator/dropdowns/`);
        setDropdowns(res.data);
        setAvailableOptions({
          bindings: res.data.bindings || [],
          interior_colors: res.data.interior_colors || [],
          paper_types: res.data.paper_types || [],
          cover_finishes: res.data.cover_finishes || []
        });
      } catch (err) {
        alert("Failed to load dropdowns.");
        console.error(err);
      } finally {
        setLoadingDropdowns(false);
      }
    };
    fetchDropdowns();
  }, []);

  // Fetch filtered options on trim size and page count change
  useEffect(() => {
    const fetchFilteredOptions = async () => {
      if (filtersShouldBeActive) {
        try {
          setLoadingAvailableOptions(true);
          const res = await axios.get(`${API_BASE}api/calculator/available-options/`, {
            params: {
              trim_size_id: form.trim_size_id,
              page_count: form.page_count,
            },
          });
          setAvailableOptions(res.data);

          // Reset form values if they are not available anymore
          setForm(prev => {
            const newForm = { ...prev };
            if (!res.data.bindings?.some(b => b.name === prev.binding_id)) newForm.binding_id = '';
            if (!res.data.interior_colors?.some(ic => ic.name === prev.interior_color_id)) newForm.interior_color_id = '';
            if (!res.data.paper_types?.some(pt => pt.name === prev.paper_type_id)) newForm.paper_type_id = '';
            if (!res.data.cover_finishes?.some(cf => cf.name === prev.cover_finish_id)) newForm.cover_finish_id = '';
            return newForm;
          });
        } catch (err) {
          alert("Failed to load available options.");
          console.error(err);
          setAvailableOptions({ bindings: [], interior_colors: [], paper_types: [], cover_finishes: [] });
        } finally {
          setLoadingAvailableOptions(false);
        }
      } else {
        setAvailableOptions({
          bindings: dropdowns.bindings || [],
          interior_colors: dropdowns.interior_colors || [],
          paper_types: dropdowns.paper_types || [],
          cover_finishes: dropdowns.cover_finishes || []
        });
      }
    };
    fetchFilteredOptions();
  }, [form.trim_size_id, form.page_count, dropdowns]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = value;
    if (type === 'number') val = value === '' ? '' : Number(value);
    setForm(prev => ({ ...prev, [name]: val }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      page_count: Number(form.page_count),
      quantity: Number(form.quantity),
    };

    if (
      !payload.trim_size_id ||
      !payload.page_count ||
      !payload.binding_id ||
      !payload.interior_color_id ||
      !payload.paper_type_id ||
      !payload.cover_finish_id ||
      payload.quantity <= 0
    ) {
      alert("Please fill in all required fields and ensure quantity is positive.");
      return;
    }

    try {
      setCalculating(true);
      const res = await axios.post(`${API_BASE}api/calculator/calculate/`, payload);
      setResult(res.data);
    } catch (err) {
      console.error("Error details:", err.response?.data || err);
      alert(`Error calculating cost: ${err.response?.data?.error || err.message}`);
    } finally {
      setCalculating(false);
    }
  };

  // Check if option is available based on name
  const isOptionAvailable = (optionType, optionName) => {
    if (!filtersShouldBeActive) return true;
    return availableOptions[optionType]?.some(option => option.name === optionName) || false;
  };

  // Get display name by id or value
  const getDisplayName = (fieldName, value) => {
    if (!value) return '-';
    switch (fieldName) {
      case 'trim_size_id':
        return dropdowns.trim_sizes?.find(t => t.id == value)?.name || '-';
      case 'binding_id':
      case 'interior_color_id':
      case 'paper_type_id':
      case 'cover_finish_id':
        return value || '-';
      default:
        return value || '-';
    }
  };

  useEffect(() => {
    document.body.style.overflowX = 'hidden';
    return () => { document.body.style.overflowX = 'auto'; };
  }, []);

  return (
    <>
      <Header />
      <section
        className="relative w-full max-w-none h-auto rounded-[20px] border-[5px] border-white/50 backdrop-blur-xl px-4 sm:px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between"
        style={{
          background: 'linear-gradient(90deg, #016AB3 16.41%, #0096CD 60.03%, #00AEDC 87.93%)',
        }}
      >
        <div className="w-full md:w-1/2 text-white text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-[28px] sm:text-[36px] md:text-[50px] font-bold leading-tight mb-3">
            Pricing <span className="text-[#F8C20A]">Calculator</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed px-2 md:px-0">
            Calculate your book's printing costs, see distribution options, estimate potential earnings, and
            download free templates with our book cost calculator.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center relative">
          <div className="flex items-center relative">
            <img src={Book1} alt="Book1" className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[260px] h-auto object-contain z-10" style={{ marginRight: '-135px' }} />
            <img src={Book2} alt="Book2" className="w-[170px] sm:w-[210px] md:w-[250px] lg:w-[270px] h-auto object-contain rotate-[4deg] z-0" />
          </div>
        </div>
      </section>

      <div className="relative z-0">
        <Carousel />
        <div className="flex" style={{ width: '100vw', minHeight: '100vh', boxSizing: 'border-box', padding: '2rem', gap: '2rem' }}>
          <div style={{
            width: '60%',
            background: 'linear-gradient(135deg, #e3f0ff 0%, #f7fbff 100%)',
            padding: '1rem 2rem',
            borderRadius: '20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h2 className="text-[32px] font-bold mb-4" style={{ color: '#2A428C' }}>Print Book</h2>

            {/* Book Size & Page Count */}
            <div className="flex flex-col gap-4 px-4 py-4 mb-8"
              style={{
                background: 'linear-gradient(90deg, #016AB3 16.41%, #0096CD 60.03%, #00AEDC 87.93%)',
                border: '1px solid #E5E5E5',
                borderRadius: '20px',
              }}
            >
              <h3 style={{ color: 'white' }} className="text-lg font-semibold">Book Size & Page Count</h3>
              <div className="flex gap-4 items-end">
                <div className="w-1/2">
                  <SelectInput name="trim_size_id" value={form.trim_size_id} options={dropdowns.trim_sizes || []} onChange={handleChange} placeholder="Select Book Size" className="h-12" />
                </div>
                <div className="w-1/2">
                  <div>
                    <p className="text-xs text-white mb-1 opacity-90">Maximum page count is 200</p>
                    <InputField
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
                      type="number"
                      placeholder="Enter Page Count"
                      min="1"
                      max="200"
                      className="h-12"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Binding Types */}
            <h2 className="text-[22px] font-bold mb-2" style={{ color: '#2A428C' }}>Binding Types</h2>
            <div className="w-full h-[2px] bg-gray-200 mb-6"></div>

            {/* Paperback Options */}
            <h3 className="text-[18px] font-semibold mb-4 text-[#2A428C]">Paperback Options</h3>
            <div className="flex gap-6 mb-10 flex-wrap">
              {[{ name: "Perfect Bound", img: PerfectBoundImg }, { name: "Coil Bound", img: CoilBoundImg }, { name: "Saddle Stitch", img: SaddleImg }].map((item, idx) => {
                const isAvailable = isOptionAvailable('bindings', item.name);
                return (
                  <label key={idx} className={`flex flex-col items-center cursor-pointer relative w-[90px] ${!isAvailable ? 'opacity-30 cursor-not-allowed' : ''}`}>
                    <div className="relative w-full">
                      <input
                        type="radio"
                        name="binding_id"
                        value={item.name}
                        checked={form.binding_id === item.name}
                        onChange={() => isAvailable && setForm({ ...form, binding_id: item.name })}
                        disabled={!isAvailable}
                        className="absolute top-[6px] left-[6px] z-10 w-3 h-3"
                      />
                      <img src={item.img} alt={item.name} className="w-[80px] h-auto object-contain mb-2 mt-3 rounded" />
                    </div>
                    <p className="text-sm text-[#2A428C] text-center">{item.name}</p>
                  </label>
                );
              })}
            </div>

            {/* Hardcover Options */}
            <h3 className="text-[18px] font-semibold mb-4 text-[#2A428C]">Hardcover Options</h3>
            <div className="flex gap-6 mb-10 flex-wrap">
              {[{ name: "Case Wrap", img: CaseWrap }, { name: "Linen Wrap", img: LinenWrap }].map((item, idx) => {
                const isAvailable = isOptionAvailable('bindings', item.name);
                return (
                  <label key={idx} className={`flex flex-col items-center cursor-pointer relative w-[90px] ${!isAvailable ? 'opacity-30 cursor-not-allowed' : ''}`}>
                    <div className="relative w-full">
                      <input
                        type="radio"
                        name="binding_id"
                        value={item.name}
                        checked={form.binding_id === item.name}
                        onChange={() => isAvailable && setForm({ ...form, binding_id: item.name })}
                        disabled={!isAvailable}
                        className="absolute top-[6px] left-[6px] z-10 w-3 h-3"
                      />
                      <img src={item.img} alt={item.name} className="w-[80px] h-auto object-contain mb-2 mt-3 rounded" />
                    </div>
                    <p className="text-sm text-[#2A428C] text-center">{item.name}</p>
                  </label>
                );
              })}
            </div>

            {/* Interior Color */}
            <h2 className="text-[22px] font-bold mb-2" style={{ color: '#2A428C' }}>Interior Color</h2>
            <div className="w-full h-[2px] bg-gray-200 mb-6"></div>
            <div className="flex gap-6 mb-10 flex-wrap">
              {[{ name: "Standard Black and White", img: StandardBlackandWhite, dbName: "Standard Black & White" },
              { name: "Premium Black and White", img: PremiumBlackandWhite, dbName: "Premium Black & White" },
              { name: "Standard Color", img: StandardColor, dbName: "Standard Color" },
              { name: "Premium Color", img: PremiumColor, dbName: "Premium Color" }].map((item, idx) => {
                const isAvailable = isOptionAvailable('interior_colors', item.dbName);
                return (
                  <label key={idx} className={`flex flex-col items-center cursor-pointer relative w-[90px] ${!isAvailable ? 'opacity-30 cursor-not-allowed' : ''}`}>
                    <div className="relative w-full">
                      <input
                        type="radio"
                        name="interior_color_id"
                        value={item.dbName}
                        checked={form.interior_color_id === item.dbName}
                        onChange={() => isAvailable && setForm({ ...form, interior_color_id: item.dbName })}
                        disabled={!isAvailable}
                        className="absolute top-[6px] left-[6px] z-10 w-3 h-3"
                      />
                      <img src={item.img} alt={item.name} className="w-[80px] h-auto object-contain mb-2 mt-3 rounded" />
                    </div>
                    <p className="text-sm text-[#2A428C] text-center">{item.name}</p>
                  </label>
                );
              })}
            </div>

            {/* Paper Type */}
            <h2 className="text-[22px] font-bold mb-2" style={{ color: '#2A428C' }}>Paper Type</h2>
            <div className="w-full h-[2px] bg-gray-200 mb-6"></div>
            <div className="flex gap-6 mb-10 flex-wrap">
              {[{ name: "60# Cream Uncoated", img: Creamuncoated, dbName: "60# Cream-Uncoated" },
              { name: "60# White Uncoated", img: Whiteuncoated, dbName: "60# White-Uncoated" },
              { name: "80# White Coated", img: Whitecoated, dbName: "80# White-Coated" },
              { name: "100# White Coated", img: Whitecoatedd, dbName: "100# White-Coated" }].map((item, idx) => {
                const isAvailable = isOptionAvailable('paper_types', item.dbName);
                return (
                  <label key={idx} className={`flex flex-col items-center cursor-pointer relative w-[90px] ${!isAvailable ? 'opacity-30 cursor-not-allowed' : ''}`}>
                    <div className="relative w-full">
                      <input
                        type="radio"
                        name="paper_type_id"
                        value={item.dbName}
                        checked={form.paper_type_id === item.dbName}
                        onChange={() => isAvailable && setForm({ ...form, paper_type_id: item.dbName })}
                        disabled={!isAvailable}
                        className="absolute top-[6px] left-[6px] z-10 w-3 h-3"
                      />
                      <img src={item.img} alt={item.name} className="w-[80px] h-auto object-contain mb-2 mt-3 rounded" />
                    </div>
                    <p className="text-sm text-[#2A428C] text-center">{item.name}</p>
                  </label>
                );
              })}
            </div>

            {/* Cover Finish */}
            <h2 className="text-[22px] font-bold mb-2" style={{ color: '#2A428C' }}>Cover Finish</h2>
            <div className="w-full h-[2px] bg-gray-200 mb-6"></div>
            <div className="flex gap-6 mb-10 flex-wrap">
              {[{ name: "Glossy", img: Glossy, dbName: "Gloss" },
              { name: "Matte", img: Matty, dbName: "Matte" }].map((item, idx) => {
                const isAvailable = isOptionAvailable('cover_finishes', item.dbName);
                return (
                  <label key={idx} className={`flex flex-col items-center cursor-pointer relative w-[90px] ${!isAvailable ? 'opacity-30 cursor-not-allowed' : ''}`}>
                    <div className="relative w-full">
                      <input
                        type="radio"
                        name="cover_finish_id"
                        value={item.dbName}
                        checked={form.cover_finish_id === item.dbName}
                        onChange={() => isAvailable && setForm({ ...form, cover_finish_id: item.dbName })}
                        disabled={!isAvailable}
                        className="absolute top-[6px] left-[6px] z-10 w-3 h-3"
                      />
                      <img src={item.img} alt={item.name} className="w-[80px] h-auto object-contain mb-2 mt-3 rounded" />
                    </div>
                    <p className="text-sm text-[#2A428C] text-center">{item.name}</p>
                  </label>
                );
              })}
            </div>

            {/* ** Here is the quantity estimate dropdown usage ** */}
            <QuantityEstimateDropdown
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              result={result}
              getDiscountInfo={getDiscountInfo}
              calculating={calculating}
              loadingAvailableOptions={loadingAvailableOptions}
            />
          </div>

          {/* Right side */}
          <div
            style={{
              width: '40%',
              background: 'white',
              padding: '2rem',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              borderRadius: '0 20px 20px 0',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            }}
          >
            <img src={RightImage} alt="High Quality Book" className="w-full h-[180px] object-cover mb-4 rounded" />
            <h2 className="text-[20px] font-bold text-[#2A428C] mb-2 text-center">High-Quality Book Printing</h2>
            <div className="w-full h-[2px] bg-gray-300 mb-4"></div>

            {[
              [['Book Size', getDisplayName('trim_size_id', form.trim_size_id)], ['Page Count', form.page_count || '-']],
              [['Binding Type', getDisplayName('binding_id', form.binding_id)], ['Interior Color', getDisplayName('interior_color_id', form.interior_color_id)]],
              [['Paper Type', getDisplayName('paper_type_id', form.paper_type_id)], ['Cover Finish', getDisplayName('cover_finish_id', form.cover_finish_id)]]
            ].map((row, i) => (
              <React.Fragment key={i}>
                <div className="flex justify-between mb-2 text-sm">
                  {row.map(([label, value], j) => (
                    <div key={j}>
                      <p className="font-semibold text-gray-600">{label}</p>
                      <p className="text-black">{value}</p>
                    </div>
                  ))}
                </div>
                <div className={`w-full h-[1px] bg-gray-200 ${i === 2 ? 'my-4' : 'my-2'}`}></div>
              </React.Fragment>
            ))}

            <div className="flex justify-center mt-6"><RedirectButton /></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Select Input component
const SelectInput = ({ label, name, value, options = [], onChange, placeholder }) => (
  <div>
    {label && <label className="block font-medium mb-1">{label}</label>}
    <select name={name} value={value} onChange={onChange} required className="w-full border px-3 py-2 rounded">
      <option value="">{placeholder || `Select ${label || name}`}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </select>
  </div>
);

// Input Field component
const InputField = ({ label, name, value, onChange, type = 'text', placeholder }) => (
  <div>
    {label && <label className="block font-medium mb-1">{label}</label>}
    <input type={type} name={name} value={value} onChange={onChange} required className="w-full border px-3 py-2 rounded" placeholder={placeholder} />
  </div>
);

export default PrintBookCalculator;
