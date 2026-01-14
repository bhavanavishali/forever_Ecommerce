import api from '@/api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";

export default function ForgotPasswordSentOtpForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError('');
    }
  };

  // Validate form before submission
  const validateForm = () => {
    let isValid = true;

    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/forgot_password_send_otp/', { email });
      setLoading(false);
      toast.success(res.data.message);
      navigate('/forgot-password-otp-verification/', { state: { email: email } });
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      {
        loading ? (
          <div className="w-full h-screen flex items-center justify-center">
            <ClipLoader color="#000" size={40} />
          </div>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 mb-2 mt-10">
              <p className="prata-regular text-3xl">Send OTP</p>
              <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
            </div>
            <form onSubmit={handleSendOtp}>
              <div className="flex flex-col">
                <input
                  type="email"
                  value={email}
                  className={`w-[300px] px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-800'}`}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                />
                {emailError && <span className="text-red-500 text-sm mt-1">{emailError}</span>}
              </div>
              <br />
              <button 
                type="submit" 
                className="bg-black text-white px-8 py-2 font-light mt-4 hover:bg-gray-800 transition-colors"
              >
                Send OTP
              </button>
              {message && <p>{message}</p>}
            </form>
          </>
        )
      }
    </div>
  );
}
