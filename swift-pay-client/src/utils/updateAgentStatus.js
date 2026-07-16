import { toast } from "react-toastify";

export const handleApprovedStatus = async (axiosPublic, endpoint, id, status, refetch) => {
    try {
        const response = await axiosPublic.put(`${endpoint}/${id}`, { status });
        if (response?.data.success) {
            toast.success(response?.data.message);
            refetch();
        } else {
            toast.error("Failed to update status");
        }
    } catch (error) {
        toast.warn(error.response?.data.message);
    }
};

