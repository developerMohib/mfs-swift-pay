import { useState } from "react";
import useAgent from "../../../../Hooks/useAgent";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { toast } from "react-toastify";
import Loader from "../../../../Components/Loader/Loader";
import { Link } from "react-router-dom";

const AgentManage = () => {
    const { agent, isLoading, refetch } = useAgent()
    const [showBalance, setShowBalance] = useState(null);
    const axiosPublic = useAxiosPublic();

    const handleSeeBalance = (id) => {
        setShowBalance(id);
        setTimeout(() => {
            setShowBalance(null);
        }, 1000);
    }

    const handleStatusChange = async (userId, newStatus) => {
        try {
            const response = await axiosPublic.put(`/agent/status/${userId}`, { status: newStatus });

            if (response.status === 200) {
                toast.success(`User is now ${newStatus}`);
                refetch()
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Error updating status");
        }
    };


    if (isLoading) { < Loader /> }
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
                        agent && agent?.map((u, id) => (
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
                                        className={`p-2 border border-primary rounded-md ${u.status === "rejected" ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        value={u.status}
                                        disabled={u.status === "rejected"}
                                        onChange={(e) => handleStatusChange(u._id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="active">Active</option>
                                        <option value="rejected">Rejected</option>
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