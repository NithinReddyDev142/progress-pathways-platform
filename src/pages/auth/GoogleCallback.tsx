
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import apiClient from "@/services/apiClient";
import { useAuth } from "@/contexts/AuthContext";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { setIsAuthenticated, setUser, setRole } = useAuth() as any;

  useEffect(() => {
    const handleGoogleCallback = async () => {
      if (token) {
        try {
          // Save the token
          localStorage.setItem(import.meta.env.VITE_AUTH_STORAGE_KEY || 'lms-auth-token', token);
          
          // Set the auth header
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data
          const response = await apiClient.get('/auth/me');
          
          if (response.data?.data) {
            const userData = response.data.data;
            
            // Map MongoDB _id to our id field
            const userWithId = {
              id: userData._id,
              username: userData.username,
              email: userData.email,
              role: userData.role,
              avatar: userData.avatar,
              createdAt: userData.createdAt,
              lastLogin: userData.lastLogin
            };
            
            // Update auth context
            setUser(userWithId);
            setIsAuthenticated(true);
            setRole(userData.role);
            
            toast.success(`Welcome, ${userData.username}!`);
            navigate('/');
          }
        } catch (error) {
          console.error("Error processing Google auth:", error);
          toast.error("Failed to complete Google authentication");
          navigate('/login');
        }
      } else {
        toast.error("Authentication failed");
        navigate('/login');
      }
    };
    
    handleGoogleCallback();
  }, [token, navigate, setIsAuthenticated, setUser, setRole]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Completing authentication...</h1>
        <p>Please wait while we process your Google sign-in.</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
