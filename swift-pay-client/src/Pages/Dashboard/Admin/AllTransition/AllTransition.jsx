import { useState } from "react";
import useGetAllTransaction from "../../../../Hooks/useGetAllTransac";
import Loader from "../../../../components/common/Loader";
const AllTransition = () => {
    const { allTransaction, isLoading } = useGetAllTransaction()
    const data = allTransaction?.data;


    const [searchQuery, setSearchQuery] = useState("");

    // Filter transactions based on searchQuery (mobile or email)
    const filteredTransactions = data?.filter(transaction => {
        const query = searchQuery.toLowerCase();

        return (
            transaction.type.toLowerCase().includes(query) ||
            transaction.amount.toString().includes(query) ||
            transaction?.sender?.userName?.toLowerCase().includes(query) ||
            transaction?.receiver?.userName?.toLowerCase().includes(query)
        );
    });

    if (isLoading) return <Loader />;
    return (
        <div className="overflow-x-auto w-full px-2 py-5">
            <h3 className='text-xl mb-3'>
                <span className="text-primary">All Transactions</span>
            </h3>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search by Name or Amount or Type"
                className="mb-4 p-2 border rounded w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Transactions Table */}
            <table className="table table-zebra outline outline-[1px] outline-base-200 shadow">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Sender</th>
                        <th>Receiver</th>
                        <th>Transaction Id</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions?.length > 0 ? (
                        filteredTransactions?.map((transaction, index) => (
                            <tr key={transaction._id}>
                                <th>{index + 1}</th>
                                <td>{transaction.type}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction?.sender?.userName} ({transaction?.sender?.userRole})</td>
                                <td>{transaction?.receiver?.userName} ({transaction?.sender?.userRole}) </td>
                                <td>{transaction._id}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-3 text-gray-500">No results found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllTransition;