/**
 * Protected Route Component - مكون المسار المحمي
 * Hospital Management System
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

/**
 * ProtectedRoute Component
 * Protects routes based on authentication and user roles
 * 
 * @param {React.ReactNode} children - Child components to render
 * @param {string[]} allowedRoles - Array of roles allowed to access this route
 * @param {boolean} requireAuth - Whether authentication is required (default: true)
 */
function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner 
          size="lg" 
          text="جاري التحقق من صحة تسجيل الدخول..." 
        />
      </div>
    );
  }

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && user) {
    const hasRequiredRole = allowedRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user role
      const redirectPath = getDashboardPath(user.role);
      return <Navigate to={redirectPath} replace />;
    }
  }

  // Render children if all checks pass
  return children;
}

/**
 * Get dashboard path based on user role
 * @param {string} role - User role
 * @returns {string} Dashboard path
 */
function getDashboardPath(role) {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'doctor':
      return '/doctor';
    case 'patient':
      return '/patient';
    default:
      return '/';
  }
}

export default ProtectedRoute;
