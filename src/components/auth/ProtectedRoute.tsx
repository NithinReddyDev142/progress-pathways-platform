
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to the login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles is specified, check if the user has the right role
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to the appropriate dashboard based on the user's role
    if (role === "admin") {
      return <Navigate to="/" replace />;
    }
    if (role === "teacher") {
      return <Navigate to="/" replace />;
    }
    if (role === "student") {
      return <Navigate to="/" replace />;
    }
    
    // Fallback to home page if role is not recognized
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated and has the right role, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
