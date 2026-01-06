import { useState } from "react";
import useAgents from "../../Hooks/useAgents";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import Loader from "../../components/common/Loader";
import { handleApprovedStatus } from "../../utils/updateAgentStatus";

const AgentManage = () => {
    const { agents, isLoading, refetch } = useAgents()
    const [showBalance, setShowBalance] = useState(null);
    const axiosPublic = useAxiosPublic();
    
    const handleSeeBalance = (id) => {
        setShowBalance(id);
        setTimeout(() => {
            setShowBalance(null);
        }, 1000);
    }

      const handleApproved = async (  id, status) => {
        await handleApprovedStatus(axiosPublic, `/approved/status`, id, status, refetch);
        await refetch();
      };

    if (isLoading) return <Loader />;
    return (
        <div className="overflow-x-auto w-full px-2 py-5">
            <h3 className='text-xl mb-3'> <span className="text-primary">Manage Agent</span></h3>
            <table className="table table-zebra outline outline-[1px] outline-base-200 shadow">
                {/* head */}
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Account Category</th>
                        <th>Balance</th>
                        <th>View Transactions</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    {
                        agents && agents?.map((u, id) => (
                            <tr key={id}>
                                <th>{id + 1}</th>
                                <td><Link to={`/all-transactions/${u.userRole}/${u._id}`}>{u.userName}</Link></td>
                                <td>{u.userPhone}</td>
                                <td> {u.userRole === 'user' ? 'Personal' : 'Agent'}</td>
                                <td><span className="cursor-pointer hover:text-secondary" onClick={() => handleSeeBalance(u._id)}> {showBalance === u._id ? `${u.balance} BDT` : "Tap to see balance"} </span></td>

                                <td> <Link to={`/all-transactions/${u.userRole}/${u._id}`} className="p-1 text-secondary hover:underline" >view briefly</Link> </td>

                                <td>
                                    <select
                                        name="accountType"
                                        className={`p-2 border border-primary rounded-md ${u.status === "block" || u.status === "active"
                                            ? "cursor-not-allowed"
                                            : "cursor-pointer"
                                            }`}
                                        value={u.status}
                                        disabled={u.status === "block" || u.status === "active"}
                                        onChange={(e) => handleApproved(u._id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="active">Active</option>
                                        <option value="block">Rejected</option>
                                    </select>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default AgentManage;