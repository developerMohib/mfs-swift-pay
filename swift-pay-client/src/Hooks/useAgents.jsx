import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useAgents = () => {
    const axiosPublic = useAxiosPublic();
    const { data: agents = [], isLoading ,refetch } = useQuery({
        queryKey: ["agent"],
        queryFn: async () => {
          const res = await axiosPublic.get("/all/agents");
          return res?.data.data;
        },
      });

      return { agents, isLoading ,refetch };
};

export default useAgents;