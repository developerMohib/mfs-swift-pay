import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

function useAgent() {
    const axiosPublic = useAxiosPublic();
    const { data: agent = [], isLoading } = useQuery ({
      queryKey: ["user"],
      queryFn: async () => {
        // To Do - get specific agent
        const res = await axiosPublic.get("/admin/find");
        return res?.data[0];
      },
    });
  
    return { agent, isLoading };
}

export default useAgent;