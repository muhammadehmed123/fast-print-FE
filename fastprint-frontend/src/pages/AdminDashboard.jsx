import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaSearch, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";  // Import Sidebar
import AdminHeader from "../components/AdminHeader";
import { BASE_URL } from "../services/baseURL";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users (admin-only endpoint)
  const fetchUsers = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(`${BASE_URL}api/users/admin/users/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data || []);
      setFilteredUsers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error.response?.data || error.message);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users by search term (email or name)
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Delete user handler
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`${BASE_URL}api/users/admin/users/${userId}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove user from state after successful delete
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error.response?.data || error.message);
      alert("Failed to delete user. Please try again.");
    }
  };

  const clearSearch = () => setSearchTerm("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading users...</p>
      </div>
    );
  }

  return (
    <>
      <AdminHeader/>
      <div className="min-h-screen flex bg-gradient-to-br from-[#eef4ff] to-[#fef6fb] font-sans">
        <Sidebar /> {/* Use Sidebar component here */}

     
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
