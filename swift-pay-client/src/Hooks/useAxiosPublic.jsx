import axios from "axios";
const useAxiosPublic = () => {
  const axiosPublic = axios.create({
    baseURL:"https://swift-pay-server-mu.vercel.app",
     timeout: 10000,
     withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
  });
  return axiosPublic;
};
// https://swift-pay-server-mu.vercel.app
// http://localhost:8000
export default useAxiosPublic;
