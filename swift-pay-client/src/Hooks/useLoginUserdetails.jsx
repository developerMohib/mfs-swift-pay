import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useUserDetails = () => {
    const axiosPublic = useAxiosPublic();
  const { data: loginUser = [], isLoading, refetch } = useQuery({
    queryKey: ["loginUser"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/user/details`);
      return res?.data.data;
    },
  });

  return { loginUser, isLoading, refetch };
};

export default useUserDetails;
