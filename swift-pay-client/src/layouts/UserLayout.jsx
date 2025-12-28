import { useContext, useState } from "react";
import { FcHome, FcMenu, FcSettings } from "react-icons/fc";
import { ImUsers, ImXing } from "react-icons/im";
import { IoLogOut } from "react-icons/io5";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../authProvider/AuthProvider";
import { toast } from "react-toastify";
import { AiOutlineTransaction } from "react-icons/ai";

const UserLayout = () => {
  const navigate = useNavigate()
  const { logout } = useContext(UserContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
      const handleLogout = () => {
        logout();
        toast.success("Log out successfully!");
        navigate('/')
      };

    return (
        <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white shadow-lg"
      >
        {sidebarOpen ? <ImXing className="w-6 h-6" /> : <FcMenu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-gray-300 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-white">
              SwiftPay
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <ImXing className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLink
            to="/dashboard/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-gray-700 text-white font-medium shadow-md'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
            end
          >
            <FcHome className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/dashboard/admin/manage-users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-gray-700 text-white font-medium shadow-md'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <ImUsers className="w-5 h-5 text-blue-400" />
            <span>Users Management</span>
          </NavLink>

          <NavLink
            to="/dashboard/admin/manage-agents"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-gray-700 text-white font-medium shadow-md'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <ImUsers className="w-5 h-5 text-green-400" />
            <span>Agents Management</span>
          </NavLink>

          <NavLink
            to="/dashboard/admin/transactions"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-gray-700 text-white font-medium shadow-md'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <AiOutlineTransaction className="w-5 h-5 text-yellow-400" />
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/dashboard/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-gray-700 text-white font-medium shadow-md'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <FcSettings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all duration-200">
            <IoLogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-0 ml-0 p-6 lg:p-8 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
    );
};

export default UserLayout;