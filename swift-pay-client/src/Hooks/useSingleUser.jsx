import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useLoginUser = ({ id }) => {
  const axiosPublic = useAxiosPublic();
  const { data: loginUser = [], isLoading, refetch } = useQuery({
    queryKey: ["loger", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axiosPublic.get(`/user/find/${id}`);
      return res?.data;
    },
  });

  return { loginUser, isLoading, refetch };
};

export default useLoginUser;