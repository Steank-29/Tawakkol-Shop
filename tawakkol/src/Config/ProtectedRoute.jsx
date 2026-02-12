import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentAdmin } from './auth';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const isAuth = isAuthenticated();
  const admin = getCurrentAdmin();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && admin?.role !== requiredRole) {
    // Redirect to appropriate dashboard or show access denied
    if (admin?.role === 'super_admin') {
      return <Navigate to="/Admin-Panel/Creating-New-Product" replace />;
    } else {
      return <Navigate to="/Admin-Panel/Creating-New-Product" replace />;
    }
  }

  // You could also add permission checks here if needed
  // if (requiredPermission && !hasPermission(requiredPermission)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return children;
};

export default ProtectedRoute;