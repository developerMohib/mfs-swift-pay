import Proptypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const UserContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();
  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axiosPublic.post("/auth/logout", {});
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const res = await axiosPublic.get("/auth/me");
        if (isMounted && res?.data?.data?.user) {
          setUser(res.data.data.user);
        }
      } catch (error) {
        // No valid session - that's fine, just stay logged out.
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    restoreSession();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userInfo = { user, setUser, login, logout, loading, setLoading };
  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: Proptypes.node,
};
export default AuthProvider;