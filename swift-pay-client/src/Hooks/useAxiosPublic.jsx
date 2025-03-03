import axios from "axios";
const useAxiosPublic = () => {
  const axiosPublic = axios.create({
    baseURL:"https://swift-pay-server-mu.vercel.app",
  });
  return axiosPublic;
};
// https://swift-pay-server-mu.vercel.app
// http://localhost:8000
export default useAxiosPublic;
