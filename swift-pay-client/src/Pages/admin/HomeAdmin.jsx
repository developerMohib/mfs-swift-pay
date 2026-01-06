import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../../components/common/Loader";
import { useState } from "react";

import {
  ImCoinDollar,
  ImUserCheck,
  ImCreditCard
} from "react-icons/im";
import {
  IoTrendingUp,
  IoAlertCircle,
  IoCheckmarkCircle,
  IoCloseCircle
} from "react-icons/io5";
import {
  MdLocalActivity,
  MdHistory,
} from "react-icons/md";
import useUsers from "../../Hooks/useUsers";
import useApprovedBlockAgent from "../../Hooks/useApprovedBlockAgent";
import usePendingAgents from "../../Hooks/usePendingAgents";
import { handleApprovedStatus } from "../../utils/updateAgentStatus";

const HomeAdmin = () => {
  const axiosPublic = useAxiosPublic();
  const [activeTab, setActiveTab] = useState('active');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { filteredAgent, isLoading: filteredAgentLoading, refetch } = useApprovedBlockAgent({ status: activeTab });
  const { pendingAgents, isLoading: pendingAgentsLoading, refetch: pendingAgentsRefetch } = usePendingAgents({ status: 'pending' });
  const { users, isLoading: usersLoading } = useUsers();

  const activeStatus = 'active';
  const blockStatus = 'block';

  const handleApproved = async (id, status) => {
    await handleApprovedStatus(axiosPublic, `/approved/status`, id, status, pendingAgentsRefetch);
    await refetch();
  };



  // Recent transaction data
  const recentTransactions = [
    { user: "Rahim Khan", amount: "৳5,000", status: "success", date: "Dec 24, 2025" },
    { user: "Ayesha Siddika", amount: "৳2,500", status: "pending", date: "Dec 23, 2025" },
    { user: "Kamal Hossain", amount: "৳10,000", status: "success", date: "Dec 23, 2025" },
    { user: "Sadia Islam", amount: "৳1,500", status: "failed", date: "Dec 22, 2025" },
    { user: "Minhaz Uddin", amount: "৳7,500", status: "success", date: "Dec 22, 2025" },
  ];

  // const pendingRequests = data?.filter(item => item.status === 'pending') || [];

  if (usersLoading || filteredAgentLoading || pendingAgentsLoading) return <Loader />;

  return (
    <div className="">

      <div className="">
        {/* Main Content */}
        <div className={`min-h-screen transition-all duration-300 ${sidebarOpen ? "lg:m" : ""}`}>
          <main className="p-4 sm:p-6">
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">

              {/* Total Users */}
              <div className="p-4 sm:p-6 rounded-xl shadow-sm border border-gray-400">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <h3 className="text-2xl sm:text-3xl font-bold ">
                      {users?.length || 0}
                    </h3>

                    <p className="mt-2">
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
              <div className="p-4 sm:p-6 rounded-xl shadow-sm border border-gray-400">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Revenue</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-2">৳{users?.length || 0}</h3>
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
              <div className=" p-4 sm:p-6 rounded-xl shadow-sm border border-gray-400">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Active Now</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-2">{users?.length || 0}</h3>
                    <p className="text-gray-500 text-sm mt-2">Live users</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <MdLocalActivity className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Pending Requests */}
              <div className="border border-gray-400 rounded-xl">
                <div>
                  <div className="flex items-center">
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1" onClick={() => setActiveTab('active')}>Active</button>
                    <button className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-1" onClick={() => setActiveTab('block')}>Block</button>
                  </div>
                  <div className="p-4 sm:p-6 rounded-xl shadow-sm ">
                    <p className="text-gray-500 text-sm capitalize">{activeTab} Agents</p>
                    <h3 className="text-2xl sm:text-3xl font-bold mt-2">{filteredAgent?.length || 0}</h3>
                    <p className="text-gray-500 text-sm mt-2">Requires action</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Chart & Recent Transactions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Chart Container */}

                {/* Recent Transactions */}
                <div className=" rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-semibold">
                        Recent Transactions
                      </h3>
                      <MdHistory className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium ">User</th>
                          <th className="text-left p-4 text-sm font-medium ">Amount</th>
                          <th className="text-left p-4 text-sm font-medium ">Status</th>
                          <th className="text-left p-4 text-sm font-medium ">Date</th>
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
                            <td className="p-4 ">{transaction.date}</td>
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
                <div className=" rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 sm:p-6 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold">
                          Pending Requests
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Action required for {pendingAgents?.length || 0} requests
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                    {pendingAgents?.length > 0 ? (
                      pendingAgents.map((request) => (
                        <div key={request._id} className=" p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10  rounded-full flex items-center justify-center">
                                <ImCreditCard className="w-5 h-5 text-blue-500" />
                              </div>
                              <div>
                                <p className="font-medium">{request.userName || "User"}</p>

                              </div>
                            </div>
                            <span className="text-lg font-semibold">ID: {request._id?.slice(-6)}</span>
                          </div>

                          <div className="text-sm text-gray-600 mb-3">
                            <p>NID Number: {request.userNID}</p>
                            <p>Requested: {new Date(request.createdAt).toLocaleDateString()}</p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproved(request._id, activeStatus)}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <IoCheckmarkCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleApproved(request._id, blockStatus)}
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
                        <p className="text-gray-500 text-sm">
                          No pending requests at the moment
                        </p>
                      </div>
                    )}
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