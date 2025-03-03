import { useState } from "react";

const AllTransition = () => {
    const transactions = [
        { id: 1, name: "Cy Ganderton", job: "Quality Control Specialist", color: "Blue", mobile: "1234567890", email: "cy@example.com" },
        { id: 2, name: "Hart Hagerty", job: "Desktop Support Technician", color: "Purple", mobile: "9876543210", email: "hart@example.com" },
        { id: 3, name: "Brice Swyre", job: "Tax Accountant", color: "Red", mobile: "5556667777", email: "br2ice@example.com" },
        { id: 4, name: "Brice Swyre", job: "Tax Accountant", color: "Ded", mobile: "5369667777", email: "br3ice@example.com" },
        { id: 5, name: "Drice Swyre", job: "Bax Accountant", color: "Ced", mobile: "5556867777", email: "bri4ce@example.com" },
    ];
    

    const [searchQuery, setSearchQuery] = useState("");

    // Filter transactions based on searchQuery (mobile or email)
    const filteredTransactions = transactions.filter(transaction =>
        transaction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.mobile.includes(searchQuery)
    );


    return (
        <div className="overflow-x-auto w-full px-2 py-5">
            <h3 className='text-xl mb-3'>
                <span className="text-primary">All Transactions</span>
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
                        <th>Favorite Color</th>
                        <th>Mobile</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions?.length > 0 ? (
                        filteredTransactions?.map((transaction, index) => (
                            <tr key={transaction.id}>
                                <th>{index + 1}</th>
                                <td>{transaction.name}</td>
                                <td>{transaction.job}</td>
                                <td>{transaction.color}</td>
                                <td>{transaction.mobile}</td>
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