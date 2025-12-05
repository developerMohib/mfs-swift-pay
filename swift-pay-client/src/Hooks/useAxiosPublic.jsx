import axios from "axios";
const useAxiosPublic = () => {
  const axiosPublic = axios.create({
    baseURL:"http://localhost:8000",
     timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
  });
  return axiosPublic;
};
// https://swift-pay-server-mu.vercel.app
// http://localhost:8000
export default useAxiosPublic;
