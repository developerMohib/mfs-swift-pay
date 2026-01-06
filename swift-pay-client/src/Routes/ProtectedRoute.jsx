import { Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({children}) => {
    const token = localStorage.getItem('auth_token');
    
    console.log("ProtectedRoute - token:", token);
    if (!token) {
        return <Navigate to="/sign-in" replace />;
    }
    return children;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
export default ProtectedRoute;