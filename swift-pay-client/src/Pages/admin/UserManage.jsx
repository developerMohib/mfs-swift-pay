import { useState } from "react";
import { Link } from "react-router-dom";
import useUsers from "../../Hooks/useUsers";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Loader from "../../components/common/Loader";
import { handleApprovedStatus } from "../../utils/updateAgentStatus";

const UserManage = () => {
    const { users, isLoading, refetch } = useUsers()
    const axiosPublic = useAxiosPublic();
    const [showBalance, setShowBalance] = useState(null);
    const handleSeeBalance = (id) => {
        setShowBalance(id);
        setTimeout(() => {
            setShowBalance(null);
        }, 1000);
    }
   
    const handleApproved = async (id, status) => {
        await handleApprovedStatus(axiosPublic, `/user/status`, id, status, refetch);
        await refetch();
    };

    if (isLoading) return <Loader />;
    return (
        <div className="overflow-x-auto w-full px-2 py-5">
            <h3 className='mb-3 font-bold text-center text-secondary text-2xl'>Manage <span className="text-primary">Users</span></h3>
            <table className="table table-zebra outline outline-[1px] outline-base-200 shadow">
                {/* head */}
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Account Category</th>
                        <th>Balance</th>
                        <th>View Transactions</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users && users?.map((u, id) => (
                            <tr key={id}>
                                <th>{id + 1}</th>
                                <td><Link to={`/all-transactions/${u.userRole}/${u._id}`}>{u.userName}</Link></td>
                                <td> {u.userRole === 'user' ? 'Personal' : 'Agent'}</td>
                                <td><span className="cursor-pointer hover:text-secondary" onClick={() => handleSeeBalance(u._id)}> {showBalance === u._id ? `${u.balance} BDT` : "Tap to see balance"} </span></td>

                                <td> <Link to={`/all-transactions/${u.userRole}/${u._id}`} className="p-1 text-secondary hover:underline" >view briefly</Link> </td>

                                <td>
                                    <select
                                        name="accountType"
                                        className="p-2 border border-primary rounded-md"
                                        value={u.status}
                                        onChange={(e) => handleApproved(u._id, e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="block">Block</option>
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

export default UserManage;