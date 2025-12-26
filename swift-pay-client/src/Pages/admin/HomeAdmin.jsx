import { toast } from "react-toastify";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../../components/common/Loader";
import { useState } from "react";

import {
  FcHome,
  FcMenu,
  FcSettings,
} from "react-icons/fc";
import {
  ImCoinDollar,
  ImUserCheck,
  ImUsers,
  ImXing,
  ImCreditCard
} from "react-icons/im";
import {
  IoLogOut,
  IoTrendingUp,
  IoWallet,
  IoAlertCircle,
  IoCheckmarkCircle,
  IoCloseCircle
} from "react-icons/io5";
import {
  MdLocalActivity,
  MdHistory,
  MdBarChart
} from "react-icons/md";
import { AiOutlineTransaction } from "react-icons/ai";
import useAgents from "../../Hooks/useAgents";

const HomeAdmin = () => {
  const axiosPublic = useAxiosPublic();

  const { agents, isLoading, refetch } = useAgents()
  const data = agents;
  const [sidebarOpen, setSidebarOpen] = useState(false)

  console.log('agents data in HomeAdmin:', agents);

  const [stats,] = useState({
    totalUsers: 12450,
    revenue: 85400,
    activeUsers: 320,
    transactions: 1234,
    pendingRequests: data?.filter(item => item.status === 'pending')?.length || 0
  });

  const handleApproved = async (id) => {
    const status = 'approved';
    try {
      const response = await axiosPublic.put(`/approved/request/${id}`, { status });
      if (response.status === 200) {
        toast.success(`Cash in Request is now ${status}`);
        refetch();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  const handleRejected = async (id) => {
    const status = 'rejected';
    try {
      const response = await axiosPublic.put(`/rejected/request/${id}`, { status });
      if (response.status === 200) {
        toast.success(`Cash in request is now ${status}`);
        refetch();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating status");
    }
  };

  // Recent transaction data
  const recentTransactions = [
    { user: "Rahim Khan", amount: "৳5,000", status: "success", date: "Dec 24, 2025" },
    { user: "Ayesha Siddika", amount: "৳2,500", status: "pending", date: "Dec 23, 2025" },
    { user: "Kamal Hossain", amount: "৳10,000", status: "success", date: "Dec 23, 2025" },
    { user: "Sadia Islam", amount: "৳1,500", status: "failed", date: "Dec 22, 2025" },
    { user: "Minhaz Uddin", amount: "৳7,500", status: "success", date: "Dec 22, 2025" },
  ];

  const pendingRequests = data?.filter(item => item.status === 'pending') || [];

  if (isLoading) return <Loader />;

  return (
    <div className="lg:grid lg:grid-cols-5">
      <div className="grid-cols-1">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-md bg-gray-600"
        >
          {sidebarOpen ? (
            <ImXing className="w-6 h-6" />
          ) : (
            <FcMenu className="w-6 h-6" />
          )}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 lg:static lg:inset-0 shadow-xl bg-white `}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b ">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">MA</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">MyApp</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden"
                >
                  <ImXing className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <a href="/dashboard/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
                <FcHome className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </a>
              <a href="/dashboard/admin/manage-users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ImUsers className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Users Management</span>
              </a>
              <a href="/dashboard/admin/manage-agents" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <ImUsers className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Agents Management</span>
              </a>
              <a href="/dashboard/admin/transactions" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <AiOutlineTransaction className="w-5 h-5 text-green-500" />
                <span className="font-medium">Transactions</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <FcSettings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </a>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t dark:border-gray-700">
              <button className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <IoLogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>
      </div>


      <div className="col-span-4">
        {/* Main Content */}
        <div className={`min-h-screen transition-all duration-300 ${sidebarOpen ? "lg:m" : ""}`}>
          <main className="p-4 sm:p-6">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Total Users */}

              <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Total Users</p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">
                      {stats.totalUsers.toLocaleString()}
                    </h3>

                    <p className="mt-2 bg-white">
                      <span className="inline-flex items-center text-green-600 text-sm">
                        <IoTrendingUp className="w-4 h-4" /> +12%
                      </span>
                    </p>
                    <span className="text-gray-500 text-sm">from last month</span>
                  </div>
                  <div className="bg-blue-900/30 rounded-lg p-3">
                    <ImUserCheck className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Revenue</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-2">৳{stats.revenue.toLocaleString()}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <IoTrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 text-sm">+8%</span>
                      <span className="text-gray-500 text-sm ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <ImCoinDollar className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                  </div>
                </div>
              </div>

              {/* Active Users */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Active Now</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-2">{stats.activeUsers}</h3>
                    <p className="text-gray-500 text-sm mt-2">Live users</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <MdLocalActivity className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Transactions */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Transactions</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-2">{stats.transactions.toLocaleString()}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <IoTrendingUp className="w-4 h-4 text-orange-500" />
                      <span className="text-orange-600 text-sm">+5%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                    <AiOutlineTransaction className="w-8 h-8 sm:w-10 sm:h-10 text-orange-500" />
                  </div>
                </div>
              </div>

              {/* Pending Requests */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Pending Requests</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-2">{stats.pendingRequests}</h3>
                    <p className="text-gray-500 text-sm mt-2">Requires action</p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                    <IoAlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Chart & Recent Transactions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Chart Container */}
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                        Revenue Overview
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Monthly revenue performance
                      </p>
                    </div>
                    <MdBarChart className="w-6 h-6 text-blue-500" />
                  </div>

                  {/* Chart Placeholder */}
                  <div className="h-64 sm:h-72 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="text-center">
                      <MdBarChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">Chart would be displayed here</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm">Integrate with Chart.js or Recharts</p>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                        Recent Transactions
                      </h3>
                      <MdHistory className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        {recentTransactions.map((transaction, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium">
                                    {transaction.user.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <span className="font-medium">{transaction.user}</span>
                              </div>
                            </td>
                            <td className="p-4 font-semibold">{transaction.amount}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${transaction.status === 'success'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : transaction.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                {transaction.status === 'success' && <IoCheckmarkCircle className="w-3 h-3 mr-1" />}
                                {transaction.status === 'pending' && <IoAlertCircle className="w-3 h-3 mr-1" />}
                                {transaction.status === 'failed' && <IoCloseCircle className="w-3 h-3 mr-1" />}
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </span>
                            </td>
                            <td className="p-4 text-gray-500 dark:text-gray-400">{transaction.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column - Pending Requests */}
              <div className="space-y-6">
                {/* Pending Requests Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                          Pending Requests
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Action required for {pendingRequests.length} requests
                        </p>
                      </div>
                      <IoAlertCircle className="w-6 h-6 text-yellow-500" />
                    </div>
                  </div>

                  <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                    {pendingRequests.length > 0 ? (
                      pendingRequests.map((request) => (
                        <div key={request._id} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <ImCreditCard className="w-5 h-5 text-blue-500" />
                              </div>
                              <div>
                                <p className="font-medium">{request.userName || "User"}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  ID: {request._id?.slice(-6)}
                                </p>
                              </div>
                            </div>
                            <span className="text-lg font-semibold">৳{request.amount || "0"}</span>
                          </div>

                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <p>Method: {request.method || "Bank Transfer"}</p>
                            <p>Requested: {new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproved(request._id)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <IoCheckmarkCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejected(request._id)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <IoCloseCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IoCheckmarkCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-1">All clear!</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          No pending requests at the moment
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors flex flex-col items-center justify-center">
                      <IoWallet className="w-6 h-6 text-blue-500 mb-2" />
                      <span className="text-sm font-medium">Add Funds</span>
                    </button>
                    <button className="p-4 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg transition-colors flex flex-col items-center justify-center">
                      <ImUsers className="w-6 h-6 text-green-500 mb-2" />
                      <span className="text-sm font-medium">Add User</span>
                    </button>
                    <button className="p-4 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-lg transition-colors flex flex-col items-center justify-center">
                      <MdBarChart className="w-6 h-6 text-purple-500 mb-2" />
                      <span className="text-sm font-medium">Reports</span>
                    </button>
                    <button className="p-4 bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 rounded-lg transition-colors flex flex-col items-center justify-center">
                      <FcSettings className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default HomeAdmin;