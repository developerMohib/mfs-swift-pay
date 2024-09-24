import Proptypes from "prop-types";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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

  const userInfo = { user, login, logout };
  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: Proptypes.node,
};
export default AuthProvider;
