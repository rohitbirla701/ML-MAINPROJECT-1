import React, { useState, useEffect } from "react";
import { PlusOutlined, MenuOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [title, setTitle] = useState("Dashboard");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/dashboard")) setTitle("Dashboard");
    else if (path.includes("/projects/new")) setTitle("New Projects");
    else if (path.includes("/projects/sent")) setTitle("Projects Sent to CEO");
    else if (path.includes("/projects/approved")) setTitle("Projects Approved by Client");
    else if (path.includes("/projects/invoice")) setTitle("Projects with Invoice Raised");
    else if (path.includes("/projects/create")) setTitle("Create New Project");
    else if (path.includes("/projects/") && path.split("/").length === 3)
      setTitle("Project Details");
    else setTitle("Dashboard");
  }, [location]);

  return (
    <header className="sticky   bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side: Toggle + Title */}
          <div className="flex items-center">
            {/* Mobile Sidebar Toggle */}
            <button className="lg:hidden mr-2" onClick={onToggleSidebar}>
              <MenuOutlined />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>

          {/* Right side: New Project + User Info */}
          <div className="flex items-center space-x-4 ">
            {/* Hide New Project button on /projects/create */}
            {!location.pathname.includes("/projects/create") && (
              <Link to="/projects/create" className=" flex items-center gap-1 bg-blue-500 rounded-md text-white font-bold hover:bg-blue-600 hover:text-white  p-2 w-33">
                <PlusOutlined className="mr-2 border rounded-md" style={{ fontSize: 18 }} />
                <span className="hidden sm:inline">New Project</span>
              </Link>
            )}

            {/* User Info */}
            {user?.fullName && (
              <div className="flex items-center">
                <span className="hidden md:block text-sm font-medium text-gray-700 mr-2">
                  Welcome, {user.fullName}
                </span>
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-gray-800 font-semibold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
