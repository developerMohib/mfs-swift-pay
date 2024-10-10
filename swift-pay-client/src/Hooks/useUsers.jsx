import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useUsers = () => {
    const axiosPublic = useAxiosPublic();
    const { data: user = [], isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            // To Do - get specific user
          const res = await axiosPublic.get("/all/users");
          return res?.data[0];
        },
      });
    
      return { user, isLoading };
};

export default useUsers;