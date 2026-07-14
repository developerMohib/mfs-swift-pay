import { useContext, useState } from "react";
import useTransaction from "../../hooks/useTransaction";
import { UserContext } from "../../authProvider/AuthProvider";
import TransitionHeader from "../../components/TransitionHeader";
import TransitionRow from "../../components/TransitionRow";
import Loader from "../../components/common/Loader";

const UserTransections = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useContext(UserContext);
    const userId = user?.id;
    const { transaction, isLoading } = useTransaction({ userId });

    // Filter by counterparty name or phone number
    const filteredTransactions = transaction?.filter((t) => {
        const q = searchQuery.toLowerCase();
        return (
            t.sender?.userName?.toLowerCase().includes(q) ||
            t.receiver?.userName?.toLowerCase().includes(q) ||
            t.sender?.userPhone?.includes(searchQuery) ||
            t.receiver?.userPhone?.includes(searchQuery) ||
            !searchQuery
        );
    });

    if (isLoading) return <Loader />;

    return (
        <div className="container-page py-8">
            <div className="mb-6">
                <h3 className="page-heading">
                    Your <span className="text-primary">Transactions</span>
                </h3>
                <p className="page-subheading">Last 100 transactions on your account</p>
            </div>

            <input
                type="text"
                placeholder="Search by name or phone..."
                className="input-minimal mb-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="overflow-x-auto card-minimal p-0">
                <table className="table table-zebra">
                    <TransitionHeader />
                    <tbody>
                        {filteredTransactions?.length > 0 ? (
                            filteredTransactions.map((t, index) => (
                                <TransitionRow key={t._id} index={index + 1} transaction={t} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-base-content/50">
                                    No transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTransections;