import Proptypes from "prop-types";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // if user has exist in local storage
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to log in and store user data in localStorage
  const login = (userData) => {
    console.log('user track', userData)
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
