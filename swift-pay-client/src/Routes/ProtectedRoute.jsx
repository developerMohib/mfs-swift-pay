import { Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useAxiosPublic from '../hooks/useAxiosPublic';
// import useUserDetails from '../hooks/useLoginUserdetails';

const ProtectedRoute = ({children}) => {
     const [isAuth, setIsAuth] = useState(null);
     const axiosPublic = useAxiosPublic();
   useEffect(() => {
    const verify = async () => {
      try {
       const res= await axiosPublic.get('/user/details', { withCredentials: true });
        console.log("ProtectedRoute - verify response:", res);
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };

    verify();
  }, [axiosPublic]);
    
   if (isAuth === null) return ;

  if (!isAuth) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
export default ProtectedRoute;