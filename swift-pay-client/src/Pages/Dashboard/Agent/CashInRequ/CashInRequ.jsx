import { toast } from "react-toastify";
import Loader from "../../../../Components/Loader/Loader";
import TransitionHeader from "../../../../Components/Transition/TransitionHeader";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import useCashinRequst from "../../../../Hooks/useCashinRequst";

const CashInRequ = () => {
    const { cashIn, isLoading, refetch } = useCashinRequst();
    const data = cashIn?.data;

    const axiosPublic = useAxiosPublic()
    const role = 'agent'
    const handleApproved = async (id) => {
        const status = 'approved'
        try {
            const response = await axiosPublic.put(`/approved/request/${id}`, { status });

            if (response.status === 200) {
                toast.success(`Cash in Request is now ${status}`);
                refetch()
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Error updating status");
        }

    }
    const handleRejected = async (id) => {
        const status = 'rejected'
        try {
            const response = await axiosPublic.put(`/rejected/request/${id}`, { status });
            if (response.status === 200) {
                toast.success(`Cash in request is now ${status}`);
                refetch()
            } else {
                toast.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Error updating status");
        }
    }

    if (isLoading) return <Loader />
    return (
        <div className="overflow-x-auto text-center w-full px-2 py-5">
            <h3 className='text-xl mb-3'>Manage <span className="text-primary">User Cashin</span> </h3>
            <table className="table table-zebra outline outline-[1px] outline-base-200 shadow">
                <TransitionHeader />
                <tbody>
                    {data?.length > 0 ? (
                        data?.map((item, index) => (
                            <tr key={item._id}>
                                <th>{index + 1}</th>
                                <td>
                                    <h4>{item.sender?.userName || "N/A"}</h4>
                                    <p>{item.sender?.phone || "N/A"}</p>
                                </td>

                                <td>{item.amount || "N/A"}</td>
                                <td>{item.type || "Cashin"}</td>
                                <td>
                                    <button
                                        className={`px-2 rounded-full capitalize
                                        ${item.status === "pending" ? "bg-base-200" :
                                                item.status === "approved" ? "bg-green-100 text-green-500" :
                                                    item.status === "rejected" ? "bg-red-50 text-red-500" : ""}`}
                                    >
                                        {item.status}
                                    </button>
                                </td>
                                {role === "agent" && (
                                    <td className="flex gap-2 items-center">
                                        <button
                                            onClick={() => handleApproved(item._id)}
                                            className="px-2 py-1 rounded-lg bg-blue-100 text-blue-500"
                                        >
                                            Approved
                                        </button>
                                        <button
                                            onClick={() => handleRejected(item._id)}
                                            className="px-2 py-1 rounded-lg bg-red-100 text-red-500"
                                        >
                                            Rejected
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4">
                                No Cashin Requests Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CashInRequ;