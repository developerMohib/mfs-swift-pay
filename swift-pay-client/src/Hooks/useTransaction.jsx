import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useTransaction = ({ userId }) => {
    const axiosPublic = useAxiosPublic();
    const { data: transaction, isLoading, refetch } = useQuery({
        queryKey: ["transition", userId],
        enabled: !!userId,
        queryFn: async () => {
            const res = await axiosPublic.get(`/user/transactions/${userId}`);
            return res?.data?.data || [];
        },
    });

    return { transaction, isLoading, refetch };
};

export default useTransaction;