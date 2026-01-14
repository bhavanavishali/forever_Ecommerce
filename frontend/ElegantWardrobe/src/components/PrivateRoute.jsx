import api from "@/api";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  console.log('privateRoute');
  console.log('isAuthenticated =',isAuthenticated);

  useEffect(() => {
    
    const checkAuth = async () => {
      try {
        await api.get("/check-auth/");  // A simple API endpoint to verify token
        setIsAuthenticated(true);
        console.log('success');
        
      } catch {
        setIsAuthenticated(false);
        console.log('failure');
        
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) return <p>Loading...</p>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

