import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute - wraps routes that require authentication.
 * Optionally restricts access to specific roles.
 *
 * Usage:
 *   <ProtectedRoute>           — any logged-in user
 *   <ProtectedRoute roles={['Admin']}> — Admin only
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    // Not logged in → redirect to login, preserve intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    // Logged in but wrong role → redirect to their dashboard
    const dashboardMap = {
      Admin: '/admin/dashboard',
      Doctor: '/doctor/dashboard',
      Patient: '/dashboard',
    };
    return <Navigate to={dashboardMap[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
