// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const sidebarLinks = [
    { label: "Manage Orders", to: "/admin/orders" },
    { label: "Manage Books", to: "/manage-books" },


    { label: "Manage Shipping", to: "/admin/shipping" },
    { label: "Manage Payment", to: "/admin/payment" },
    { label: "Manage Users", to: "/manage-users" },
  ];


  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-[#016AB3]">Admin Panel</h2>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarLinks.map(({ label, to }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`block px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive
                  ? "bg-[#016AB3] text-white"
                  : "text-gray-700 hover:bg-[#016AB3] hover:text-white"
                }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
