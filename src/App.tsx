
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { LmsProvider } from './contexts/LmsContext';
import Index from './pages/Index';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GoogleCallback from './pages/auth/GoogleCallback';
import { Toaster } from 'sonner';
import CoursesList from './pages/courses/CoursesList';
import CourseDetail from './pages/courses/CourseDetail';
import CourseForm from './pages/courses/CourseForm';

const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <LmsProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth/google/callback" element={<GoogleCallback />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                
                {/* Course routes */}
                <Route path="/courses" element={<CoursesList />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/courses/create" element={<CourseForm />} />
                <Route path="/courses/edit/:id" element={<CourseForm />} />
                
                {/* Add other protected routes here */}
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </LmsProvider>
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
