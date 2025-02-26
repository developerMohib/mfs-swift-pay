import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useTransaction = ({ userId }) => {
    const axiosPublic = useAxiosPublic();
    const { data :transaction, isLoading, refetch } = useQuery({
        queryKey: ["transition"],
        queryFn: async () => {
            // To Do - get specific user
            const res = await axiosPublic.get(`/all/transactions/${userId}`);
            return res?.data || [ ];
        },
    });

    return {transaction, isLoading, refetch };
};

export default useTransaction;