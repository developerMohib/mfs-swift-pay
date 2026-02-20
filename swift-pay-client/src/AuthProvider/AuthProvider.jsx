import Proptypes from "prop-types";
import { createContext, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const UserContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const axiosPublic = useAxiosPublic();
  
  // Function to log out and remove user data from localStorage
  const logout = async () => {
    try {
      setLoading(true);
      await axiosPublic.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const userInfo = { user, setUser,  logout, loading, setLoading };
  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: Proptypes.node,
};
export default AuthProvider;
