import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  PlusOutlined,
  SendOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bg-white  flex flex-col justify-between pb-6 h-full min-w-fit max-h-screen overflow-auto">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 p-4">
          <h2 className="text-lg font-semibold">ML Projects</h2>
        </div>

        {/* Navigation Links */}
        <ul className="px-2 space-y-1">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isActive("/dashboard")
                  ? "bg-purple-100 text-purple-700"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              <HomeOutlined /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/projects/new"
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isActive("/projects/new")
                  ? "bg-purple-100 text-purple-700"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              <PlusOutlined /> New Projects
            </Link>
          </li>
          <li>
            <Link
              to="/projects/sent-to-ceo"
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isActive("/projects/sent-to-ceo")
                  ? "bg-purple-100 text-purple-700"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              <SendOutlined /> Sent to CEO
            </Link>
          </li>
          <li>
            <Link
              to="/projects/approved-by-client"
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isActive("/projects/approved-by-client")
                  ? "bg-purple-100 text-purple-700"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              <CheckCircleOutlined /> Approved by Client
            </Link>
          </li>
          <li>
            <Link
              to="/projects/invoice-raised"
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isActive("/projects/invoice-raised")
                  ? "bg-purple-100 text-purple-700"
                  : "text-black hover:bg-gray-100"
              }`}
            >
              <FileTextOutlined /> Invoice Raised
            </Link>
          </li>
        </ul>
      </div>

      {/* Bottom User Section */}
      <div className="p-3 mx-3 mb-20 lg:mb-1 m-16 bg-gray-50 rounded w-300 w-[220px]">
        <div className="flex items-center gap-3 mb-2">
          <UserOutlined className="bg-purple-100 p-2 rounded-full text-purple-600 text-lg" />
          <div className="truncate">
            <p className="text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 border rounded-md py-1 text-sm bg-gray-50 hover:bg-gray-100"
        >
          <LogoutOutlined /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
