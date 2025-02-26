import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useUsers = () => {
    const axiosPublic = useAxiosPublic();
    const { data: user = [], isLoading ,refetch } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            // To Do - get specific user
          const res = await axiosPublic.get("/all/users");
          return res?.data;
        },
      });
    
      return { user, isLoading ,refetch };
};

export default useUsers;