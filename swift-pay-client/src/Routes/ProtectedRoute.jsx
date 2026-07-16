import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { UserContext } from '../authProvider/AuthProvider';

/**
 * Guards a route behind login, and optionally a specific set of roles.
 * Relies on AuthProvider's session-restore (GET /auth/me) rather than
 * re-checking on every route - previously this only ever checked the
 * User collection (via /user/details), which meant an agent or admin
 * dashboard had no real protection at all.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;