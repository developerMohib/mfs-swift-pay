import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useGetAllTransaction = () => {
    const axiosPublic = useAxiosPublic();
    const { data :allTransaction, isLoading, refetch } = useQuery({
        queryKey: ["transition"],
        queryFn: async () => {
            // To Do - get specific user
            const res = await axiosPublic.get(`/all/transaction`);
            return res?.data || [];
        },
    });

    return {allTransaction, isLoading, refetch };
};

export default useGetAllTransaction;