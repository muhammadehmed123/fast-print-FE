import Header from "../components/Header";
import Footer from "../components/Footer";
import PersonalIcon from "../assets/images/newsletter.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import QuantityEstimateDropdown from "../components/QuantityEstimateDropdown";

// PDF.js worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Image imports
import PerfectBoundImg from "../assets/images/perfectbound.png";
import CoilBoundImg from "../assets/images/coilbound.png";
import SaddleImg from "../assets/images/saddle.png";
import CaseWrap from "../assets/images/casewrap.png";
import LinenWrap from "../assets/images/linenwrap.png";
import WireOBoundImg from "../assets/images/wireo.jpg";
import StandardBlackandWhite from "../assets/images/int1.png";
import PremiumBlackandWhite from "../assets/images/in2.png";
import StandardColor from "../assets/images/in3.png";
import PremiumColor from "../assets/images/int4.png";
import Creamuncoated from "../assets/images/pp1.jpg";
import Whiteuncoated from "../assets/images/pp2.jpg";
import Whitecoated from "../assets/images/pp3.jpg";
import Whitecoatedd from "../assets/images/pp4.jpg";
import Glossy from "../assets/images/glossy.png";
import Matty from "../assets/images/matty.png";
import { BASE_URL } from "../services/baseURL";

const API_BASE = `${BASE_URL}`;

const IMAGE_MAPS = {
  binding: { "Perfect Bound": PerfectBoundImg, "Coil Bound": CoilBoundImg, "Saddle Stitch": SaddleImg, "Case Wrap": CaseWrap, "Linen Wrap": LinenWrap, "Wire O": WireOBoundImg },
  interiorColor: { "Standard Black & White": StandardBlackandWhite, "Premium Black & White": PremiumBlackandWhite, "Standard Color": StandardColor, "Premium Color": PremiumColor },
  paperType: { "60# Cream-Uncoated": Creamuncoated, "60# White-Uncoated": Whiteuncoated, "80# White-Coated": Whitecoated, "100# White-Coated": Whitecoatedd },
  coverFinish: { Gloss: Glossy, Matte: Matty }
};

const API_ENDPOINTS = {
  "Photo Book": { dropdown: "/api/photobook/dropdowns/", binding: "/api/photobook/bindings/", calculate: "/api/photobook/calculate/" },
  "Print Book": { dropdown: "/api/calculator/dropdowns/", binding: "/api/calculator/bindings/", calculate: "/api/calculator/calculate/" },
  "Magazine": { dropdown: "/api/magazine/dropdowns/", binding: "/api/magazine/bindings/", calculate: "/api/magazine/calculate/" },
  "Year Book": { dropdown: "/api/yearbook/dropdowns/", binding: "/api/yearbook/bindings/", calculate: "/api/yearbook/calculate/" },
  "Calender": { dropdown: "/api/calender/dropdowns/", binding: "/api/calender/bindings/", calculate: "/api/calender/calculate/" },
  "Comic Book": { dropdown: "/api/comicbook/dropdowns/", binding: "/api/comicbook/bindings/", calculate: "/api/comicbook/calculate/" }
};

// Discount function (you can adjust this based on your business logic)
const getDiscountInfo = (qty) => {
  if (qty >= 1000) return { percent: 15, price: 17.93 };
  if (qty >= 500) return { percent: 10, price: 18.98 };
  if (qty >= 100) return { percent: 5, price: 20.04 };
  return null;
};

const OptionField = ({ title, name, options, imageMap, form, handleChange }) => (
  <fieldset className="mb-6">
    <legend className="font-semibold text-[#2A428C] mb-4 text-lg">{title}</legend>
    <div className="flex flex-wrap gap-4">
      {Array.from(new Map(options.map(opt => [opt.name, opt])).values()).map(opt => (
        <label key={opt.id} className={`cursor-pointer flex flex-col items-center w-28 p-3 border rounded-lg transition ${form[name] === opt.id ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"}`}>
          <input type="radio" name={name} value={opt.id} checked={form[name] === opt.id} onChange={handleChange} className="mb-2" />
          {imageMap[opt.name] && <img src={imageMap[opt.name]} alt={opt.name} className="w-16 h-16 object-contain mb-2" />}
          <span className="text-center text-sm text-gray-700">{opt.name}</span>
        </label>
      ))}
    </div>
  </fieldset>
);

const DesignProject = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [fileError, setFileError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [usedExpertCover, setUsedExpertCover] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [dropdowns, setDropdowns] = useState({});
  const [bindings, setBindings] = useState([]);
  const [initialBindings, setInitialBindings] = useState([]);
  const [initialBindingsLoaded, setInitialBindingsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    trim_size_id: "",
    page_count: "",
    binding_id: "",
    interior_color_id: "",
    paper_type_id: "",
    cover_finish_id: "",
    quantity: 1 // Added quantity for price calculation
  });

  // Price calculation states
  const [result, setResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const coverFileInputRef = useRef(null);

  useEffect(() => {
    if (location.state) setProjectData(location.state);
  }, [location.state]);

  const fetchData = async (url) => {
    try {
      const res = await axios.get(`${API_BASE}${url}`);
      return res.data || [];
    } catch (err) {
      console.error(`Failed to load data from ${url}:`, err);
      return [];
    }
  };

  const fetchInitialBindings = async () => {
    const endpoints = API_ENDPOINTS[projectData.category];
    if (!endpoints) return;

    const bindingsData = await fetchData(endpoints.binding);
    setInitialBindings(bindingsData);
    setBindings(bindingsData);
    setInitialBindingsLoaded(true);
    localStorage.setItem("bindings", JSON.stringify(bindingsData));
  };

  const fetchDropdownsAndBindings = async () => {
    const endpoints = API_ENDPOINTS[projectData.category];
    if (!endpoints) {
      setDropdowns({});
      setLoading(false);
      return;
    }

    const dropdownData = await fetchData(endpoints.dropdown);
    setDropdowns(dropdownData);

    ["cover_finishes", "interior_colors", "paper_types", "trim_sizes"].forEach(key => {
      localStorage.setItem(key, JSON.stringify(dropdownData[key] || []));
    });

    await fetchInitialBindings();
    setLoading(false);
  };

  const fetchFilteredBindings = async (trim_size_id, page_count) => {
    const endpoints = API_ENDPOINTS[projectData?.category];
    if (!endpoints) return;

    const params = projectData.category === "Calender" ? {} : { trim_size_id, page_count };
    const bindingsData = await fetchData(`${endpoints.binding}?${new URLSearchParams(params)}`);
    setBindings(bindingsData);
  };

  useEffect(() => {
    if (!projectData?.category) return;
    setLoading(true);
    setBindings([]);
    setInitialBindings([]);
    setInitialBindingsLoaded(false);
    setResult(null); // Reset price calculation when category changes
    fetchDropdownsAndBindings();
  }, [projectData?.category]);

  useEffect(() => {
    if (!initialBindingsLoaded) return;

    if (projectData?.category === "Calender") {
      setBindings(initialBindings);
      return;
    }

    const { trim_size_id, page_count } = form;
    if (trim_size_id && page_count) {
      fetchFilteredBindings(trim_size_id, page_count);
    } else {
      setBindings(initialBindings);
    }
  }, [form.trim_size_id, form.page_count, initialBindingsLoaded, projectData?.category]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? (value === "" ? "" : Number(value)) : value;

    if ((name === "trim_size_id" || name === "page_count") && projectData?.category !== "Calender") {
      setForm(prev => ({ ...prev, [name]: val, binding_id: "" }));
    } else {
      setForm(prev => ({ ...prev, [name]: val }));
    }

    // Reset calculation result when form changes
    if (name !== "quantity") {
      setResult(null);
    }
  };

  // Price calculation function
  const handlePriceCalculation = async (e) => {
    if (e) e.preventDefault();

    const endpoints = API_ENDPOINTS[projectData?.category];
    if (!endpoints?.calculate) {
      alert("Price calculation not available for this category");
      return;
    }

    // Check if all required fields are filled
    const isCalendar = projectData?.category === "Calender";
    const requiredFields = isCalendar
      ? ["binding_id", "interior_color_id", "paper_type_id", "cover_finish_id", "quantity"]
      : ["trim_size_id", "page_count", "binding_id", "interior_color_id", "paper_type_id", "cover_finish_id", "quantity"];

    const missingFields = requiredFields.filter(field => !form[field]);
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    setCalculating(true);
    try {
      const calculationData = {
        trim_size_id: form.trim_size_id,
        page_count: isCalendar ? (form.page_count || 1) : form.page_count,
        binding_id: form.binding_id,
        interior_color_id: form.interior_color_id,
        paper_type_id: form.paper_type_id,
        cover_finish_id: form.cover_finish_id,
        quantity: form.quantity
      };

      // Remove trim_size_id for Calendar category if not needed
      if (isCalendar) {
        delete calculationData.trim_size_id;
      }

      const response = await axios.post(`${API_BASE}${endpoints.calculate}`, calculationData);
      setResult(response.data);
    } catch (error) {
      console.error("Calculation error:", error);
      alert("Failed to calculate price. Please try again.");
    } finally {
      setCalculating(false);
    }
  };

  const handleContactExpert = () => {
    localStorage.setItem('designForm', JSON.stringify(form));
    localStorage.setItem('projectData', JSON.stringify(projectData));
    setUsedExpertCover(true);
    navigate('/cover-expert');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setFileError("");
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadProgress(0);

    if (!file) return;
    if (file.type !== "application/pdf") {
      setFileError("Only PDF files are allowed.");
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const pageCount = pdf.numPages;

        if (pageCount < 2 || pageCount > 800) {
          setFileError("Page count must be between 2 and 800.");
          setUploadStatus("error");
          return;
        }

        setForm(prev => ({ ...prev, page_count: pageCount }));
        setSelectedFile(file);
        setUploadStatus("success");
      } catch {
        setFileError("Invalid PDF file or corrupted.");
        setUploadStatus("error");
      }
    };
    fileReader.readAsArrayBuffer(file);
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(null);

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Cover design must be a JPG, PNG, or PDF file.");
      return;
    }
    setCoverFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return alert("Please upload your book PDF file");

    const isCalendar = projectData?.category === "Calender";
    const requiredFields = isCalendar
      ? ["binding_id", "interior_color_id", "paper_type_id", "cover_finish_id"]
      : ["trim_size_id", "page_count", "binding_id", "interior_color_id", "paper_type_id", "cover_finish_id"];

    if (!requiredFields.every(field => form[field])) {
      return alert("Please complete all book configuration options");
    }

    if (!projectData?.category || !projectData?.language || !token) {
      return alert(token ? "Please select a valid category and language." : "You must be logged in to submit the project.");
    }

    try {
      const formData = new FormData();
      formData.append("title", projectData.projectTitle || "");
      formData.append("category", projectData.category);
      formData.append("language", projectData.language);
      formData.append("pdf_file", selectedFile);
      if (coverFile) formData.append("cover_file", coverFile);

      const getOptionName = (options, id) => options.find(opt => opt.id === Number(id))?.name || '';

      formData.append('binding_type', getOptionName(bindings, form.binding_id));
      formData.append('cover_finish', getOptionName(dropdowns.cover_finishes || [], form.cover_finish_id));
      formData.append('interior_color', getOptionName(dropdowns.interior_colors || [], form.interior_color_id));
      formData.append('paper_type', getOptionName(dropdowns.paper_types || [], form.paper_type_id));

      if (!isCalendar) formData.append('trim_size', getOptionName(dropdowns.trim_sizes || [], form.trim_size_id));

      formData.append('page_count', isCalendar ? (form.page_count || 1) : form.page_count);

      const response = await axios.post(`${API_BASE}/api/book/upload-book/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
      });

      if (response.data?.status === "success") {
        alert("Project submitted successfully!");
const quantity = form.quantity || 0;  // move up first
const originalTotalCost = result?.original_total_cost ?? (result.cost_per_book * quantity);
const finalTotalCost = result?.total_cost ?? originalTotalCost;

// Pass both total costs and quantity to Shop page
navigate("/shop", {
  state: {
    originalTotalCost,
    finalTotalCost,
    initialQuantity: quantity
  }
});
;
      } else {
        alert("Submission failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.response?.data?.message || error.message || "An error occurred while submitting your project.");
    }
  };

  const renderCalculatorOptions = () => {
    if (loading) return <div className="text-center py-8 text-blue-700">Loading calculator options...</div>;

    const { interior_colors = [], paper_types = [], cover_finishes = [], trim_sizes = [] } = dropdowns;
    const isCalendar = projectData?.category === "Calender";

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {!isCalendar && (
          <div className="mb-8 p-6 bg-gradient-to-r from-[#016AB3] via-[#0096CD] to-[#00AEDC] rounded-lg">
            <h3 className="text-white text-lg font-semibold mb-4">Book Size & Page Count</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Trim Size</label>
                <select name="trim_size_id" value={form.trim_size_id} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white" required>
                  <option value="">Select Trim Size</option>
                  {trim_sizes.map(ts => <option key={ts.id} value={ts.id}>{ts.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-white text-sm font-medium mb-2">Page Count</label>
                <input type="number" name="page_count" value={form.page_count} onChange={handleChange} min="1" max="800" className="w-full p-3 border border-gray-300 rounded-lg bg-white" placeholder="Enter Page Count" required />
              </div>
            </div>
          </div>
        )}

        <OptionField title="Binding Type" name="binding_id" options={bindings} imageMap={IMAGE_MAPS.binding} form={form} handleChange={handleChange} />
        <OptionField title="Interior Color" name="interior_color_id" options={interior_colors} imageMap={IMAGE_MAPS.interiorColor} form={form} handleChange={handleChange} />
        <OptionField title="Paper Type" name="paper_type_id" options={paper_types} imageMap={IMAGE_MAPS.paperType} form={form} handleChange={handleChange} />
        <OptionField title="Cover Finish" name="cover_finish_id" options={cover_finishes} imageMap={IMAGE_MAPS.coverFinish} form={form} handleChange={handleChange} />

        {/* Add the Quantity Estimate Dropdown here */}
        <div className="mt-8">
          <QuantityEstimateDropdown
            form={form}
            handleChange={handleChange}
            handleSubmit={handlePriceCalculation}
            result={result}
            getDiscountInfo={getDiscountInfo}
            calculating={calculating}
            loadingAvailableOptions={loading}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Header />

      <div className="w-full h-[51px] flex items-center justify-center gap-8 px-6 bg-gradient-to-r from-[#016AB3] via-[#0096CD] to-[#00AEDC] font-sans">
        <span className="text-white text-lg font-semibold cursor-pointer" onClick={() => navigate("/start-project")}>Start Project</span>
        <span className="text-white text-lg font-semibold cursor-pointer" onClick={() => navigate("/design-project")}>Designs</span>
      </div>

      <div className="w-full min-h-screen px-6 py-10 bg-gradient-to-br from-[#eef4ff] to-[#fef6fb] font-sans">
        <div className="max-w-[909px] mx-auto p-12 rounded-2xl shadow-xl bg-gradient-to-r from-[#ffe4ec] via-[#fdfdfd] to-[#e0f3ff] flex flex-col gap-10">

          <div>
            <h1 className="text-[#2A428C] text-[24px] font-bold">Interior File Upload</h1>
            <div className="w-[675px] h-[206px] mx-auto border border-dashed border-[#2A428C] rounded-2xl flex flex-col items-center justify-center gap-4 bg-white mt-6 relative">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#2A428C]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="20" height="20">
                  <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.67v4h4V9h3.67L12 2z" />
                </svg>
              </div>

              {uploadStatus === "uploading" && (
                <>
                  <p className="text-[#2A428C] font-semibold text-[16px] text-center">Uploading... {uploadProgress}%</p>
                  <div className="w-48 h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </>
              )}

              {uploadStatus === "success" && selectedFile && (
                <p className="text-green-600 font-semibold text-[16px] text-center">{selectedFile.name} uploaded successfully!</p>
              )}

              {(uploadStatus === "idle" || uploadStatus === "error") && (
                <p className="text-[#2A428C] font-semibold text-[16px] text-center">
                  {selectedFile ? selectedFile.name : "Upload your PDF file or Drag & Drop it here"}
                </p>
              )}

              {fileError && <p className="text-red-600 text-sm text-center mt-2">{fileError}</p>}
            </div>
          </div>

          {projectData && (
            <div className="flex flex-col gap-5">
              <h2 className="text-[#2A428C] text-[28px] font-bold">Project Information</h2>
              <div className="bg-gradient-to-r from-white to-[#f0f7ff] p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 ease-in-out border border-[#dceeff]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className="text-[#2A428C] font-semibold text-sm uppercase tracking-wide">Project Title</span>
                    <span className="text-gray-800 text-base mt-1">{projectData.projectTitle}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#2A428C] font-semibold text-sm uppercase tracking-wide">Language</span>
                    <span className="text-gray-800 text-base mt-1">{projectData.language || "Not specified"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#2A428C] font-semibold text-sm uppercase tracking-wide">Category</span>
                    <span className="text-gray-800 text-base mt-1">{projectData.category}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <h2 className="text-[#2A428C] text-[24px] font-bold">Book Configuration</h2>
            {renderCalculatorOptions()}
          </div>

          <div className="w-full mt-10">
            <h2 className="text-[#2A428C] font-bold text-[36px] mb-2">Book Cover Design</h2>
            <hr className="border-t border-black w-full mb-4" />
            <div className="w-full border rounded-[20px] px-6 py-6 flex items-center gap-4 shadow-sm mb-6 bg-white border-[#ECECEC] cursor-pointer" onClick={() => coverFileInputRef.current?.click()}>
              <img src={PersonalIcon} alt="Personal" className="h-[48px] w-[48px]" />
              <div>
                <h3 className="text-black font-semibold text-base">Upload Your Cover</h3>
                <p className="text-black text-sm">Upload a cover for your book</p>
              </div>
            </div>
            <input type="file" accept="image/jpeg,image/png,application/pdf" ref={coverFileInputRef} onChange={handleCoverFileChange} style={{ display: "none" }} />
            {coverFile && <p className="text-green-600 text-center mb-4">Selected cover: {coverFile.name}</p>}
          </div>


          <div className="flex flex-col items-center gap-6 mt-10">
            <button onClick={handleContactExpert} disabled={!!coverFile} className="w-[650px] px-10 py-3 bg-gradient-to-r from-[#0a79f8] to-[#1e78ee] text-white font-medium text-[16px] rounded-full shadow-md hover:shadow-lg">
              Contact Cover Design Expert
            </button>

            <button onClick={handleSubmit} disabled={uploadStatus === "uploading"} className="w-[650px] px-10 py-3 bg-gradient-to-r from-[#F8C20A] to-[#EE831E] text-white font-medium text-[16px] rounded-full shadow-md hover:shadow-lg">
              Print Your Book
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DesignProject;