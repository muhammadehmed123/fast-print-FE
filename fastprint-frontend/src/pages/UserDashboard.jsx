import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaEdit,
  FaPlus,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaTimes,
  FaChartLine,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserBanner from "../components/UserBanner";
import { BASE_URL } from "../services/baseURL"; // Import centralized base URL

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function to get user-specific cart key
  const getUserCartKey = () => {
    return `cart_${user?.id || "guest"}`;
  };

  // Helper function to get user-specific cart
  const getUserCart = () => {
    const cartKey = getUserCartKey();
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  };

  // Helper function to save user-specific cart
  const saveUserCart = (cartData) => {
    const cartKey = getUserCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cartData));
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`${BASE_URL}api/book/${projectId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooks((prev) => prev.filter((book) => book.id !== projectId));
      setFilteredBooks((prev) => prev.filter((book) => book.id !== projectId));
    } catch (error) {
      console.error(
        "Failed to delete project:",
        error.response?.data || error.message
      );
      alert("Failed to delete project. Please try again.");
    }
  };

  const handleEdit = (project) => {
    navigate("/start-project", { state: { projectData: project, isEdit: true } });
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(`${BASE_URL}api/book/my-books/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Get user-specific cart project IDs
        const cart = getUserCart();
        const cartIds = cart.map((item) => item.id);

        // Filter out books already in user's cart
        const availableBooks = (response.data.data || []).filter(
          (book) => !cartIds.includes(book.id)
        );

        setBooks(availableBooks);
        setFilteredBooks(availableBooks);
      } catch (error) {
        console.error(
          "Failed to fetch books:",
          error.response?.data || error.message
        );
        setBooks([]);
        setFilteredBooks([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBooks();
    }
  }, [user]);

  // Clean up old cart data when user changes
  useEffect(() => {
    if (user) {
      // Clean up any old generic cart data
      const oldCart = localStorage.getItem("cart");
      if (oldCart) {
        localStorage.removeItem("cart");
      }
    }
  }, [user]);

  // Filter books based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [searchTerm, books]);

  // Sort filtered books
  useEffect(() => {
    if (sortConfig.key) {
      const sorted = [...filteredBooks].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });

      setFilteredBooks(sorted);
    }
  }, [sortConfig, filteredBooks]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === "asc" ? (
        <FaSortUp className="text-[#016AB3]" />
      ) : (
        <FaSortDown className="text-[#016AB3]" />
      );
    }
    return <FaSort className="opacity-40 group-hover:opacity-70 transition-opacity" />;
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Handle Add to Cart with user-specific storage
  const handleAddToCart = (book) => {
    const existingCart = getUserCart();
    if (!existingCart.some((item) => item.id === book.id)) {
      const updatedCart = [...existingCart, book];
      saveUserCart(updatedCart);
      setBooks((prev) => prev.filter((b) => b.id !== book.id));
      setFilteredBooks((prev) => prev.filter((b) => b.id !== book.id));
    }
    navigate("/orders");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] to-[#fef6fb] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#016AB3]/20 border-t-[#016AB3]" />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#0096CD] animate-spin"
              style={{ animationDuration: "0.8s" }}
            />
          </div>
          <p className="text-xl font-semibold text-[#016AB3] mt-6">Loading your projects...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (!books.length) {
    return (
      <>
        <Header />
        <div className="min-h-screen w-full bg-gradient-to-br from-[#eef4ff] to-[#fef6fb] font-sans">
          <div className="w-full h-[60px] flex items-center px-8 bg-gradient-to-r from-[#016AB3] via-[#0096CD] to-[#00AEDC] shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <h1 className="text-white text-xl font-bold">Project Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#016AB3] via-[#0096CD] to-[#00AEDC] px-6 py-10 text-center relative">
                <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-sm">
                    <FaPlus className="text-white text-xl" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-3">
                    Welcome {user?.name || "User"}
                  </h1>
                  <p className="text-blue-100 text-base mb-5 leading-snug">
                    You haven't created any projects yet. Start one now!
                  </p>
                  <button
                    onClick={() => navigate("/start-project")}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#F8C20A] to-[#EE831E] text-white text-sm font-semibold rounded-full shadow hover:shadow-md hover:scale-105 transition-all duration-300"
                  >
                    <FaPlus className="text-sm mr-2" />
                    Start Project
                  </button>
                </div>
              </div>

              <div className="px-6 py-5 bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-[#016AB3]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FaEdit className="text-[#016AB3] text-base" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Create</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-[#016AB3]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FaChartLine className="text-[#016AB3] text-base" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Track</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-[#016AB3]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FaCheckCircle className="text-[#016AB3] text-base" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Complete</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <UserBanner />
      <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] to-[#fef6fb] py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Total Projects
                  </p>
                  <p className="text-4xl font-bold text-[#016AB3] mt-2">{books.length}</p>
                  <p className="text-xs text-gray-400 mt-1">All time</p>
                </div>
                <div className="bg-gradient-to-br from-[#016AB3] to-[#0096CD] p-4 rounded-2xl shadow-lg">
                  <FaPlus className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    In Cart
                  </p>
                  <p className="text-4xl font-bold text-emerald-600 mt-2">{getUserCart().length}</p>
                  <p className="text-xs text-gray-400 mt-1">Ready to order</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                  <FaChartLine className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Main Table Card */}
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100">
            {/* Professional Header */}
            <div className="bg-gradient-to-r from-[#016AB3] via-[#0096CD] to-[#00AEDC] px-8 py-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm"></div>
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <h1 className="text-white text-2xl font-bold mb-2">Project Management</h1>
                  <p className="text-blue-100 text-sm">
                    Monitor and manage all your projects from one place
                  </p>
                </div>
                <button
                  onClick={() => navigate("/start-project")}
                  className="flex items-center gap-3 bg-gradient-to-r from-[#F8C20A] to-[#EE831E] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-xl"
                >
                  <FaPlus className="text-sm" />
                  <span>New Project</span>
                </button>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="relative max-w-md flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search projects by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#016AB3] focus:border-transparent bg-white text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 text-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-700 transition-colors duration-200"
                    >
                      <FaTimes className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>

                {searchTerm && (
                  <div className="ml-6 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
                    <span className="font-semibold text-[#016AB3]">{filteredBooks.length}</span> of{" "}
                    {books.length} projects
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th
                      className="group px-8 py-6 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 select-none"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-2">
                        <span>Project Title</span>
                        {getSortIcon("title")}
                      </div>
                    </th>
                    <th
                      className="group px-8 py-6 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200 select-none"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center gap-2">
                        <span>Category</span>
                        {getSortIcon("category")}
                      </div>
                    </th>
                    <th className="px-8 py-6 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredBooks.length > 0 ? (
                    filteredBooks.map((book, index) => (
                      <tr
                        key={book.id}
                        className={`hover:bg-gradient-to-r hover:from-[#F8FAFF] hover:to-[#F0F7FF] transition-all duration-300 group ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-[#016AB3] to-[#0096CD] rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">
                                {book.title && book.title.length > 0 ? book.title.charAt(0) : "P"}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-[#016AB3] transition-colors duration-200">
                                {book.title || "Untitled Project"}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Created{" "}
                                {book.created_at
                                  ? new Date(book.created_at).toLocaleDateString()
                                  : new Date().toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#F0F7FF] to-[#E3F1FF] text-[#016AB3] border border-blue-200/50 shadow-sm">
                            {book.category || "General"}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleAddToCart(book)}
                              className="px-4 py-2 bg-gradient-to-r from-[#016AB3] to-[#0096CD] text-white rounded-full text-sm font-semibold hover:scale-105 transition-transform duration-200"
                            >
                              Add to Cart
                            </button>

                            <button
                              onClick={() => handleEdit(book)}
                              className="p-3 text-[#016AB3] hover:text-[#0096CD] hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md group"
                            >
                              <FaEdit className="text-sm group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleDelete(book.id)}
                              className="p-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md group"
                            >
                              <FaTrash className="text-sm group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaSearch className="text-2xl text-gray-400" />
                          </div>
                          <p className="text-lg font-semibold text-gray-700">No projects found</p>
                          <p className="text-sm mt-2 text-gray-500">
                            {searchTerm ? `No projects match "${searchTerm}"` : "Try adjusting your search terms"}
                          </p>
                          {searchTerm && (
                            <button
                              onClick={clearSearch}
                              className="mt-4 px-6 py-2 bg-[#016AB3] text-white rounded-lg hover:bg-[#0096CD] transition-colors duration-200 shadow-sm"
                            >
                              Clear Search
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Enhanced Footer */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-[#016AB3]">{filteredBooks.length}</span> of{" "}
                  <span className="font-semibold">{books.length}</span> projects
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Last synced: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserDashboard;
