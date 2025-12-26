import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

function useApprovedBlockAgent({ status }) {
  const axiosPublic = useAxiosPublic();
  const { data: filteredAgent = [], isLoading, refetch } = useQuery({
    queryKey: ["filteredAgent",status],
    queryFn: async () => {
      const res = await axiosPublic.get(`/agent/status/${status}`);
      return res?.data.data;
    },
  });

  return { filteredAgent, isLoading, refetch };
}

export default useApprovedBlockAgent;