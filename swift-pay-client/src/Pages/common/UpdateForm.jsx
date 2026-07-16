
const UpdateForm = () => {
    return (
        <div className="container mx-auto p-4">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-[black] mb-6">Update User</h1>
            <form className="grid grid-cols-1 gap-6">
                {/* Username */}
                <div className="p-2">
                    <input type="text" id="userName" name="userName" placeholder="Username" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{ backgroundColor: '#f6f6f6' }} />
                </div>
                {/* bio and Image Upload */}
                <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bio */}
                    <div>
                        <textarea id="bio" name="bio" rows={3} placeholder="User Biography" className="block w-full h-48 rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{ backgroundColor: '#f6f6f6' }} defaultValue={""} />
                    </div>
                    {/* Image Upload */}
                    <div>
                        <label htmlFor="avatar" className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex flex-col items-center justify-center bg-[#f6f6f6] hover:bg-gray-50">
                            <div className="text-center">
                                <div className="mb-2">
                                    <button type="button" className="bg-[#8c0327] hover:bg-[#6b0220] text-white rounded-full py-2 px-4">Select from the computer</button>
                                </div>
                                <p className="text-gray-500">or drag photo here</p>
                                <p className="text-gray-500 text-sm mt-1">PNG, JPG, SVG</p>
                            </div>
                        </label>
                        <input id="avatar" name="avatar" type="file" accept="image/*" className="sr-only" />
                    </div>
                </div>
                {/* User First name  and Last name */}
                <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User First Name */}
                    <div>
                        <input type="text" id="firstName" name="firstName" placeholder="First name" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{ backgroundColor: '#f6f6f6' }} />
                    </div>
                    {/* User Last name */}
                    <div>
                        <input type="text" id="lastName" name="lastName" placeholder="Last name" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{ backgroundColor: '#f6f6f6' }} />
                    </div>
                </div>
                {/* Email */}
                <div className="p-2">
                    <input type="email" id="email" name="email" placeholder="Email" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{ backgroundColor: '#f6f6f6' }} />
                </div>
                {/* Current password */}
                <div className="p-2">
                    <input type="password" id="currentPassword" name="currentPassword" placeholder="Current password" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{ backgroundColor: '#f6f6f6' }} />
                </div>
                {/* New password and Confirm password */}
                <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* New password */}
                    <div>
                        <input type="password" id="newPassword" name="newPassword" placeholder="New password" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{ backgroundColor: '#f6f6f6' }} />
                    </div>
                    {/* User Last name */}
                    <div>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirmation password" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8c0327] focus:ring-[#8c0327] focus:ring-opacity-50 p-2" style={{ backgroundColor: '#f6f6f6' }} />
                    </div>
                </div>
                {/* Registration Button */}
                <div className="col-span-full mt-6 p-2">
                    <button type="submit" className="block w-full bg-[#8c0327] hover:bg-[#6b0220] text-white font-bold py-3 px-4 rounded-full">
                        Update user
                    </button>
                </div>
            </form>
        </div>

    );
};

export default UpdateForm;