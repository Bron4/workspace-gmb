import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute: Checking authentication");
  console.log("ProtectedRoute: isAuthenticated:", isAuthenticated);
  console.log("ProtectedRoute: current location:", location.pathname);
  console.log("ProtectedRoute: localStorage accessToken:", !!localStorage.getItem('accessToken'));
  console.log("ProtectedRoute: localStorage refreshToken:", !!localStorage.getItem('refreshToken'));

  if (!isAuthenticated) {
    console.log("ProtectedRoute: User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute: User authenticated, rendering protected content");
  return <>{children}</>;
}