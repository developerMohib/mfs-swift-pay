import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useAdmin = () => {
    const axiosPublic = useAxiosPublic();
    const { data: admin = [], isLoading } = useQuery({
        queryKey: ["admin"],
        queryFn: async () => {
            // To Do - get specific admin
          const res = await axiosPublic.get("/get-admin");
          return res?.data[0];
        },
      });
    
      return { admin, isLoading };
};

export default useAdmin;