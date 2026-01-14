import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google'; 

import { useNavigate } from 'react-router-dom';
import api from '../api';
import { USER_ACCESS_TOKEN, USER_REFRESH_TOKEN } from '../constants';
import { toast } from 'react-toastify';
import { ShopContext } from '@/context/ShopContext';

const GoogleAuth = () => {
    const navigate = useNavigate();
    const {setIsAuthenticated } = useContext(ShopContext);
  const handleSuccess = async (response) => {
    const token = response.credential; // Google token

    try {
      // Send token to Django backend
      const res = await api.post('/google-login/', {
        token,
      });
      setIsAuthenticated(true)
      toast.success("Login Successful");
      navigate('/',{ replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleError = (error) => {
    console.error('Google Login Error:', error);
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap // Optional: Enable one-tap login
      />
    </div>
  );
};

export default GoogleAuth;
