import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useUsers from "../../../../Hooks/useUsers";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Loader from "../../../../Components/Loader/Loader";

const UserManage = () => {
    const { user, isLoading, refetch } = useUsers()
    const axiosPublic = useAxiosPublic();
    const [showBalance, setShowBalance] = useState(null);
    const handleSeeBalance = (id) => {
        setShowBalance(id);
        setTimeout(() => {
            setShowBalance(null);
        }, 1000);
    }

    const handleStatusChange = async (userId, newStatus) => {
        try {
            const response = await axiosPublic.put(`/user/status/${userId}`, { status: newStatus });

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
                        user && user?.map((u, id) => (
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
                                        onChange={(e) => handleStatusChange(u._id, e.target.value)}
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