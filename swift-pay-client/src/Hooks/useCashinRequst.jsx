import useAxiosPublic from './useAxiosPublic';
import { useQuery } from '@tanstack/react-query';

const useCashinRequst = () => {
    const axiosPublic = useAxiosPublic();
    const { data: cashIn = [], isLoading ,refetch } = useQuery({
        queryKey: ["cashin"],
        queryFn: async () => {
            // To Do - get specific user
          const res = await axiosPublic.get("/agent/cash-in/request");
          return res?.data;
        },
      });
    
      return { cashIn, isLoading ,refetch };
};

export default useCashinRequst;