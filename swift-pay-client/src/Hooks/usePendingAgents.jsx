import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

function usePendingAgents({ status }) {
  const axiosPublic = useAxiosPublic();
  const { data: pendingAgents = [], isLoading, refetch } = useQuery({
    queryKey: ["pendingAgent",status],
    queryFn: async () => {
      const res = await axiosPublic.get(`/agent/status/${status}`);
      return res?.data.data;
    },
  });

  return { pendingAgents, isLoading, refetch };
}

export default usePendingAgents;