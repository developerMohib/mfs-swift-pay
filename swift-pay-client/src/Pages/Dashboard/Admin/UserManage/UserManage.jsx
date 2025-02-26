import { useState } from "react";
import useUsers from "../../../../Hooks/useUsers";

const UserManage = () => {
    const { user, isLoading } = useUsers()
    const [showBalance, setShowBalance] = useState(null);
    const handleSeeBalance = (id) => {
        setShowBalance(id);
        setTimeout(() => {
            setShowBalance(null);
        }, 1000);
    }
    if (isLoading) { <p>Loading....</p> }
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
                        <th>View Details</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        user && user?.map((u, id) => (
                            <tr key={id}>
                                <th>{id + 1}</th>
                                <td>{u.userName}</td>
                                <td> {u.userRole}</td>
                                <td><span className="cursor-pointer hover:text-secondary" onClick={() => handleSeeBalance(u._id)}> {showBalance === u._id ? `${u.balance} BDT` : "Tap to see balance"} </span></td>
                                <td> <button className="p-1 border border-primary rounded-md" >view briefly</button> </td>
                                <td>
                                    <select
                                        name="accountType"
                                        className="p-2 border border-primary rounded-md"
                                    >
                                        <option defaultValue>{u.status}</option>
                                        <option>block</option>
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