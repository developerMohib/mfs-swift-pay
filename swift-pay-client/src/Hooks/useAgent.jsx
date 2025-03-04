import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

function useAgent() {
  const axiosPublic = useAxiosPublic();
  const { data: agent = [], isLoading,refetch } = useQuery({
    queryKey: ["agent"],
    queryFn: async () => {
      // To Do - get specific agent
      const res = await axiosPublic.get("/all/agent");
      return res?.data;
    },
  });

  return { agent, isLoading,refetch };
}

export default useAgent;