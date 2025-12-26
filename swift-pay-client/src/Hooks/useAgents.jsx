import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useAgents = () => {
    const axiosPublic = useAxiosPublic();
    const { data: agents = [], isLoading ,refetch } = useQuery({
        queryKey: ["agent"],
        queryFn: async () => {
            // To Do - get specific agent
          const res = await axiosPublic.get("/all/agents");
          return res?.data;
        },
      });

      return { agents, isLoading ,refetch };
};

export default useAgents;