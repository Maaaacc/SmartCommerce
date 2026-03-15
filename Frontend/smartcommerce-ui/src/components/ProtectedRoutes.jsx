// components/ProtectedRoutes.jsx - COMPLETE REWRITE
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyAuth } from '../services/authService';
import { CircularProgress, Box, Alert } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null); // null = loading, true/false = result

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await verifyAuth();
        setIsAuth(authStatus);
      } catch (error) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading while verifying
  if (isAuth === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
