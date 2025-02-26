import { useState } from "react";
import useAgent from "../../../../Hooks/useAgent";

const AgentManage = () => {
    const { agent, isLoading } = useAgent()
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
            <h3 className='text-xl mb-3'> <span className="text-primary">Manage Agent</span></h3>
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
                    {/* row 1 */}
                    {
                        agent && agent?.map((u, id) => (
                            <tr key={id}>
                                <th>{id + 1}</th>
                                <td>{u.userName}</td>
                                <td> {u.userRole} {u.balance}</td>
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

export default AgentManage;