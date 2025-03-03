import { useContext, useState } from "react";
import TransitionHeader from "../../../../Components/Transition/TransitionHeader";
import TransitionRow from "../../../../Components/Transition/TransitionRow";
import { UserContext } from "../../../../AuthProvider/AuthProvider";
import useTransaction from "../../../../Hooks/useTransaction";
import Loader from "../../../../Components/Loader/Loader";

const Transections = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useContext(UserContext);
    const userId = user?._id
    const { transaction, isLoading } = useTransaction({ userId })


    // Filter transactions by user name or mobile number
    const filteredTransactions = transaction?.filter(transaction =>
        transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.mobile.includes(searchQuery)
    );
    console.log('transaction', transaction)
    if (isLoading) return <Loader />;
    return (
        <div className="overflow-x-auto w-full px-2 py-5">
            <h3 className='text-xl mb-3'>User <span className='text-primary'>Transactions</span></h3>
            <table className="table outline outline-[1px] outline-base-200 shadow">
                {/* head */}
                <TransitionHeader />
                <tbody>
                    {
                        [0].map(item => <TransitionRow key={item} />)
                    }
                </tbody>
            </table>
            <div className="overflow-x-auto w-full px-2 py-5">
                <h3 className='text-xl mb-3'>
                    <span className="text-primary">Last 100 Transactions</span>
                </h3>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search by Name or Mobile..."
                    className="mb-4 p-2 border rounded w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Transactions Table */}
                <table className="table table-zebra outline outline-[1px] outline-base-200 shadow">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Job</th>
                            <th>Mobile</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions?.length > 0 ? (
                            filteredTransactions?.map((transaction, index) => (
                                <tr key={transaction._id}>
                                    <th>{index + 1}</th>
                                    <td>{transaction.name}</td>
                                    <td>{transaction.job}</td>
                                    <td>{transaction.mobile}</td>
                                    <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-3 text-gray-500">No transactions found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Transections;