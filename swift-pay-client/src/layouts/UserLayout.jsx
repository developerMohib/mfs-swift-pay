import { useContext, useState } from "react";
import { FcHome, FcMenu, FcSettings } from "react-icons/fc";
import { ImUsers, ImXing } from "react-icons/im";
import { IoLogOut } from "react-icons/io5";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineTransaction } from "react-icons/ai";
import useUserDetails from "../Hooks/useLoginUserdetails";
import Loader from "../components/common/Loader";
import { UserContext } from "../authProvider/AuthProvider";

const UserLayout = () => {
    const navigate = useNavigate();
    const { logout } = useContext(UserContext);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { loginUser, isLoading } = useUserDetails();
console.log("UserLayout - loginUser:", loginUser);
    const handleLogout = async() => {
      await logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    if (isLoading) return <Loader />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] relative">
            {/* Mobile Menu Toggle Button - Visible only on <768px */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-800 text-white shadow-lg"
            >
                {sidebarOpen ? <ImXing className="w-6 h-6" /> : <FcMenu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-gray-300 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 md:block`}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                        <Link to="/dashboard/user" className="text-2xl font-bold text-white">
                            SwiftPay
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden text-gray-400 hover:text-white"
                        >
                            <ImXing className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-1">
                    <NavLink
                        to="/dashboard/user"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? "bg-gray-700 text-white font-medium shadow-md"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`
                        }
                        end
                    >
                        <FcHome className="w-5 h-5" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/user/cash-in"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? "bg-gray-700 text-white font-medium shadow-md"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`
                        }
                        end
                    >
                        <FcHome className="w-5 h-5" />
                        <span>Cash In</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/user/send-money"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? "bg-gray-700 text-white font-medium shadow-md"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`
                        }
                    >
                        <ImUsers className="w-5 h-5 text-blue-400" />
                        <span>Send Money</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/user/cash-out"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? "bg-gray-700 text-white font-medium shadow-md"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`
                        }
                    >
                        <ImUsers className="w-5 h-5 text-green-400" />
                        <span>Cash Out</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/user/transactions"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? "bg-gray-700 text-white font-medium shadow-md"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`
                        }
                    >
                        <AiOutlineTransaction className="w-5 h-5 text-yellow-400" />
                        <span>Transactions</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/user/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? "bg-gray-700 text-white font-medium shadow-md"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`
                        }
                    >
                        <FcSettings className="w-5 h-5" />
                        <span>Settings</span>
                    </NavLink>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all duration-200"
                    >
                        <IoLogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="overflow-y-auto">
                {/* Optional Banner */}
                <div className="p-4 md:p-6 lg:p-8">
                    <div className="avatar flex justify-end">
                        <div className="w-14 rounded-full">
                            <img title={loginUser?.userName}
                                className="w-40 h-40 rounded-full mx-auto"
                                src={loginUser?.userPhoto}
                                alt={loginUser?.userName}
                            />
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserLayout;