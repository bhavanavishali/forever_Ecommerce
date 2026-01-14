import api from '@/api';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    if (errors.newPassword) {
      setErrors((prev) => ({ ...prev, newPassword: '' }));
    }

    if (errors.confirmPassword && value === confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else {
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
        isValid = false;
      }
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await api.post('/reset_forgot_password/', {
        email,
        new_password: newPassword,
      });
      toast.success(res.data.message);
      navigate('/login/');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Reset failed');
    }
  };

  return (
    <div>
      <form onSubmit={handleResetPassword}>
        <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-3xl">Reset Password</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
          </div>

          {/* New Password Field */}
          <div className="flex flex-col w-full">
            <div className="relative w-[300px]">
              <input
                type={showNewPassword ? 'text' : 'password'}
                className={`w-full px-3 py-2 pr-10 border ${errors.newPassword ? 'border-red-500' : 'border-gray-800'}`}
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="New Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="text-red-500 text-sm mt-1 max-w-[300px]">
                {errors.newPassword}
              </span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col w-full">
            <div className="relative w-[300px]">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`w-full px-3 py-2 pr-10 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-800'}`}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm mt-1 max-w-[300px]">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-black text-white px-8 py-2 font-light mt-4 hover:bg-gray-800 transition-colors"
          >
            Reset Password
          </button>
        </div>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
