import Proptypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import useAxiosPublic from "../Hooks/useAxiosPublic";

export const UserContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
const axiosPublic = useAxiosPublic()


useEffect(() => {
  const userData = async () => {
    try {
      const response = await axiosPublic.get('/get-admin');
      const data = response.data[0];
      console.log( "for admin", data)
      // setAdminData(response.data); // Save the response data in state
    } catch (error) {
      console.error('Error fetching admin data:', error);
      // setError(error); // Save the error in state
    }
  };

  userData(); // Call the async function to fetch data
}, [axiosPublic]);



  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // if user has exist in local storage
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to log in and store user data in localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user data in localStorage
  };

  // Function to log out and remove user data from localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const userInfo = { user, setUser, login, logout, loading, setLoading };
  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: Proptypes.node,
};
export default AuthProvider;
