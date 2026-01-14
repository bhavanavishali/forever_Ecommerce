import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { USER_ACCESS_TOKEN } from '../constants';

const PublicRoute = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(()=>{
    const checkAuth = async () => {
          try {
            await api.get("/check-auth/");  // A simple API endpoint to verify token
            setIsAuthenticated(true);
 
            
          } catch {
            setIsAuthenticated(false);
          }
        };
        checkAuth();
  },[])


  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
