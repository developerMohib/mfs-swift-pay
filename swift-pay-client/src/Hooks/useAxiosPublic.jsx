import axios from "axios";
const useAxiosPublic = () => {
  const axiosPublic = axios.create({
    baseURL:"https://swift-pay-server-mu.vercel.app",
  });
  return axiosPublic;
};

export default useAxiosPublic;
