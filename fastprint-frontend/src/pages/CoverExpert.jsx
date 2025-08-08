import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../services/baseURL"; // Import centralized base URL


const CoverExpert = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bookTitle: "",
    bookGenre: "",
    description: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [designForm, setDesignForm] = useState(null);
  const [dropdowns, setDropdowns] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchDropdownData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/book/dropdown-data/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDropdowns(response.data);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    const savedProject = localStorage.getItem("projectData");
    const savedForm = localStorage.getItem("designForm");
    if (savedProject && savedForm) {
      try {
        setProjectData(JSON.parse(savedProject));
        setDesignForm(JSON.parse(savedForm));
      } catch (error) {
        console.error("Error parsing saved data:", error);
        setErrors({ general: "Error loading saved project data. Please start over." });
      }
    }
    if (token) fetchDropdownData();
  }, [token]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.bookTitle.trim()) newErrors.bookTitle = "Book title is required";
    if (!formData.bookGenre.trim()) newErrors.bookGenre = "Book genre is required";
    if (!formData.description.trim()) newErrors.description = "Cover description is required";
    if (!selectedFile) newErrors.file = "PDF file is required";
    else if (selectedFile.type !== "application/pdf") newErrors.file = "Only PDF files are allowed";
    else if (selectedFile.size > 50 * 1024 * 1024) newErrors.file = "File size must be less than 50MB";
    if (!projectData || !designForm) newErrors.general = "Missing project data. Please complete previous steps first.";
    if (!token) newErrors.general = "Authentication required. Please log in.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (errors.file) setErrors(prev => ({ ...prev, file: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const apiData = new FormData();

      const bindings = JSON.parse(localStorage.getItem("bindings") || "[]");
      const coverFinishes = JSON.parse(localStorage.getItem("cover_finishes") || "[]");
      const interiorColors = JSON.parse(localStorage.getItem("interior_colors") || "[]");
      const paperTypes = JSON.parse(localStorage.getItem("paper_types") || "[]");
      const trimSizes = JSON.parse(localStorage.getItem("trim_sizes") || "[]");
      const designForm = JSON.parse(localStorage.getItem("designForm") || "{}");
      const projectData = JSON.parse(localStorage.getItem("projectData") || "{}");

      const binding = bindings.find(b => String(b.id) === String(designForm.binding_id))?.name || '';
      const coverFinish = coverFinishes.find(cf => String(cf.id) === String(designForm.cover_finish_id))?.name || '';
      const interiorColor = interiorColors.find(ic => String(ic.id) === String(designForm.interior_color_id))?.name || '';
      const paperType = paperTypes.find(pt => String(pt.id) === String(designForm.paper_type_id))?.name || '';
      const trimSize = trimSizes.find(ts => String(ts.id) === String(designForm.trim_size_id))?.name || '';

      apiData.append("title", projectData.projectTitle || "");
      apiData.append("category", projectData.category || "");
      apiData.append("language", projectData.language || "");
      apiData.append("page_count", designForm.page_count || "");
      apiData.append("binding_type", binding);
      apiData.append("cover_finish", coverFinish);
      apiData.append("interior_color", interiorColor);
      apiData.append("paper_type", paperType);
      apiData.append("trim_size", trimSize);
      apiData.append("pdf_file", selectedFile);

      apiData.append("cover_description", formData.description || "");
      apiData.append("contact_name", formData.name || "");
      apiData.append("contact_email", formData.email || "");
      apiData.append("book_title", formData.bookTitle || "");
      apiData.append("book_genre", formData.bookGenre || "");
      apiData.append("is_cover_expert", "true");

      const response = await axios.post(`${BASE_URL}api/book/upload-book/`, apiData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data?.status === "success") {
        localStorage.removeItem("projectData");
        localStorage.removeItem("designForm");
        localStorage.removeItem("bindings");
        localStorage.removeItem("cover_finishes");
        localStorage.removeItem("interior_colors");
        localStorage.removeItem("paper_types");
        localStorage.removeItem("trim_sizes");
        alert("Project submitted successfully! Our cover design expert will contact you soon.");
        navigate("/shop");
      } else {
        throw new Error(response.data?.message || "Submission failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Upload failed. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <>
      <Header />

      {/* Navigation Tabs */}
      <div className="w-full h-[51px] flex items-center justify-center gap-8 px-6 bg-gradient-to-r from-[#016AB3] via-[#0096CD] to-[#00AEDC] font-sans">
        <span
          onClick={() => navigate("/start-project")}
          className="text-white text-lg font-semibold cursor-pointer pb-1 border-b-4 border-transparent hover:border-yellow-400 transition-all"
        >
          Start Project
        </span>
        <span
          onClick={() => navigate("/design-project")}
          className="text-white text-lg font-semibold cursor-pointer pb-1 border-b-4 border-transparent hover:border-yellow-400 transition-all"
        >
          Designs
        </span>
        <span className="text-white text-lg font-semibold cursor-pointer pb-1 border-b-4 border-yellow-400">
          Cover Expert
        </span>
      </div>

      {/* Main Content */}
      <div className="w-full min-h-screen px-6 py-10 bg-gradient-to-br from-[#eef4ff] to-[#fef6fb] font-sans">
        <div className="max-w-[909px] mx-auto p-12 rounded-2xl shadow-xl bg-gradient-to-r from-[#ffe4ec] via-[#fdfdfd] to-[#e0f3ff]">
          {/* Header */}
          <div className="relative flex justify-center items-center mb-10">
            <div className="absolute left-0 right-0 h-[4px] bg-gradient-to-r from-[#D15D9E] to-[#5D4495] z-0" />
            <div className="h-[47px] w-[440px] flex items-center justify-center text-white font-medium text-md z-10 bg-gradient-to-r from-[#D15D9E] to-[#5D4495] rounded-full">
              Contact Cover Design Expert
            </div>
          </div>

          {/* Project Summary */}
          {projectData && designForm && (
            <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-[#2A428C] text-lg font-semibold mb-3">Project Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Title:</strong> {projectData.projectTitle}</div>
                <div><strong>Category:</strong> {projectData.category}</div>
                <div><strong>Language:</strong> {projectData.language || 'Not specified'}</div>
                <div><strong>Page Count:</strong> {designForm.page_count}</div>
              </div>
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-[700px] mx-auto bg-white p-8 rounded-2xl shadow-md">
            <div>
              <label className="text-black font-semibold block mb-1">Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full border rounded-md p-3 text-sm ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-black font-semibold block mb-1">Your Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full border rounded-md p-3 text-sm ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-black font-semibold block mb-1">Book Title *</label>
              <input
                type="text"
                name="bookTitle"
                value={formData.bookTitle}
                onChange={handleChange}
                required
                className={`w-full border rounded-md p-3 text-sm ${errors.bookTitle ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Enter your book title"
              />
              {errors.bookTitle && <p className="text-red-500 text-sm mt-1">{errors.bookTitle}</p>}
            </div>

            <div>
              <label className="text-black font-semibold block mb-1">Book Genre *</label>
              <input
                type="text"
                name="bookGenre"
                value={formData.bookGenre}
                onChange={handleChange}
                required
                className={`w-full border rounded-md p-3 text-sm ${errors.bookGenre ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="e.g., Fiction, Non-fiction, Romance, Thriller"
              />
              {errors.bookGenre && <p className="text-red-500 text-sm mt-1">{errors.bookGenre}</p>}
            </div>

            <div>
              <label className="text-black font-semibold block mb-1">
                Cover Design Requirements also mention your Binding Type*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
                className={`w-full border rounded-md p-3 text-sm resize-none ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="Please describe the type of cover design you want. Include details about style, colors, themes, or any specific requirements..."
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="text-black font-semibold block mb-1">Please Again Upload Your Book (PDF) *</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                required
                className={`w-full border rounded-md p-3 text-sm ${errors.file ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              />
              {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
              {selectedFile && (
                <p className="text-green-600 text-sm mt-1">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#F8C20A] to-[#EE831E] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <p className="text-center text-sm text-gray-600 mt-1">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 text-white text-[16px] font-medium rounded-full shadow-md transition-all ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-[#F8C20A] to-[#EE831E] hover:shadow-lg"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit to Cover Expert"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoverExpert;
