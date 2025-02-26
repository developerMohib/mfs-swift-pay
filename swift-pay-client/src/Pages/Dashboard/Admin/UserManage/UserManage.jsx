
const UserManage = () => {
    const handleSeeBalance = (id) => {
        console.log('id', id)
    }

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
                    {/* row 1 */}
                    <tr>
                        <th>1</th>
                        <td>User Nmae</td>
                        <td> userRole </td>
                        <td><span className="cursor-pointer hover:text-secondary" onClick={handleSeeBalance}>Tap To See Balance</span></td>
                        <td> <button className="p-1 border border-primary rounded-md" >view briefly</button> </td>
                        <td>
                            <select
                                name="accountType"
                                className="p-2 border border-primary rounded-md"
                            >
                                <option defaultValue>Active</option>
                                <option>block</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <th>1</th>
                        <td>Cy Ganderton</td>
                        <td>Quality Control Specialist</td>
                        <td>Blue</td>
                        <td>Blue</td>
                        <td>Blue</td>
                    </tr>
                    <tr>
                        <th>1</th>
                        <td>User Nmae</td>
                        <td> userRole </td>
                        <td> <span className="cursor-pointer hover:text-secondary" onClick={handleSeeBalance}>Tap To See Balance</span> </td>
                        <td> <button className="p-1 border border-primary rounded-md " >view briefly</button> </td>
                        <td>
                            <select
                                name="accountType"
                                className="p-2 border border-primary rounded-md"
                            >
                                <option defaultValue>Active</option>
                                <option>block</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default UserManage;