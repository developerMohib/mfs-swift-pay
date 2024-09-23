import axios from "axios";
const useAxiosPublic = () => {
  const axiosPublic = axios.create({
    baseURL: `${import.meta.env.VITE_baseUrl}`,
  });
  return axiosPublic;
};

export default useAxiosPublic;
