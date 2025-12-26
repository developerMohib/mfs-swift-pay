import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useUsers = () => {
    const axiosPublic = useAxiosPublic();
    const { data: users = [], isLoading ,refetch } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            // To Do - get specific user
          const res = await axiosPublic.get("/all/users");
          return res?.data;
        },
      });
    
      return { users, isLoading ,refetch };
};

export default useUsers;