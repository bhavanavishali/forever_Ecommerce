import React, { useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const ManagePassword = () => {
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  // State for each password field's visibility
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // State for validation errors and touched fields
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation functions
  const validateOldPassword = (value) => {
    if (!value.trim()) return "Current password is required";
    return "";
  };

  const validateNewPassword = (value) => {
    if (!value) return "New password is required";
    if (value.length < 8) return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(value)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(value)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(value)) return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(value)) return "Password must contain at least one special character (@$!%*?&)";
    return "";
  };

  const validateConfirmPassword = (value, newPassword) => {
    if (!value) return "Please confirm your new password";
    if (value !== newPassword) return "Passwords do not match";
    return "";
  };

  // Real-time validation
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "old_password":
        error = validateOldPassword(value);
        break;
      case "new_password":
        error = validateNewPassword(value);
        // Also revalidate confirm password if it exists
        if (passwordData.confirm_password) {
          setErrors(prev => ({
            ...prev,
            confirm_password: validateConfirmPassword(passwordData.confirm_password, value)
          }));
        }
        break;
      case "confirm_password":
        error = validateConfirmPassword(value, passwordData.new_password);
        break;
      default:
        break;
    }
    return error;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {};
    newErrors.old_password = validateOldPassword(passwordData.old_password);
    newErrors.new_password = validateNewPassword(passwordData.new_password);
    newErrors.confirm_password = validateConfirmPassword(passwordData.confirm_password, passwordData.new_password);
    
    setErrors(newErrors);
    setTouched({
      old_password: true,
      new_password: true,
      confirm_password: true,
    });

    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handlePasswordReset = async(e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateAllFields()) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    try {
      await api.put("/reset_password/", passwordData);
      toast.success("Password reset successfully!");
      
      // Reset form after successful password change
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
      setErrors({});
      setTouched({});
      
    } catch (error) {
      if (error?.response?.data?.error) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error("Error resetting password. Please try again!");
      }
      console.log(error);
    }
  };

  // Input styling with validation states
  const getInputClassName = (fieldName) => {
    const baseClass = "w-full px-3 py-2 pr-10 border transition-colors duration-200";
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClass} border-red-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500`;
    } else if (touched[fieldName] && !errors[fieldName]) {
      return `${baseClass} border-green-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`;
    }
    return `${baseClass} border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`;
  };

  return (
    <form
      onSubmit={handlePasswordReset}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Reset Password</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* Old Password */}
      <div className="w-full">
        <div className="relative">
          <input
            className={getInputClassName("old_password")}
            type={showOld ? "text" : "password"}
            name="old_password"
            placeholder="Current Password"
            value={passwordData.old_password}
            onChange={handlePasswordChange}
            onBlur={handleBlur}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={() => setShowOld((v) => !v)}
            tabIndex={-1}
          >
            {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.old_password && touched.old_password && (
          <p className="text-red-500 text-sm mt-1">{errors.old_password}</p>
        )}
      </div>

      {/* New Password */}
      <div className="w-full">
        <div className="relative">
          <input
            className={getInputClassName("new_password")}
            type={showNew ? "text" : "password"}
            name="new_password"
            placeholder="New Password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
            onBlur={handleBlur}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={() => setShowNew((v) => !v)}
            tabIndex={-1}
          >
            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.new_password && touched.new_password && (
          <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>
        )}
        
        {/* Password Requirements Hint */}
        {touched.new_password && (
          <div className="text-xs text-gray-600 mt-1">
            <p>Password must contain:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li className={passwordData.new_password.length >= 8 ? "text-green-600" : "text-red-500"}>
                At least 8 characters
              </li>
              <li className={/(?=.*[a-z])/.test(passwordData.new_password) ? "text-green-600" : "text-red-500"}>
                One lowercase letter
              </li>
              <li className={/(?=.*[A-Z])/.test(passwordData.new_password) ? "text-green-600" : "text-red-500"}>
                One uppercase letter
              </li>
              <li className={/(?=.*\d)/.test(passwordData.new_password) ? "text-green-600" : "text-red-500"}>
                One number
              </li>
              <li className={/(?=.*[@$!%*?&])/.test(passwordData.new_password) ? "text-green-600" : "text-red-500"}>
                One special character (@$!%*?&)
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="w-full">
        <div className="relative">
          <input
            className={getInputClassName("confirm_password")}
            type={showConfirm ? "text" : "password"}
            name="confirm_password"
            placeholder="Confirm New Password"
            value={passwordData.confirm_password}
            onChange={handlePasswordChange}
            onBlur={handleBlur}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={() => setShowConfirm((v) => !v)}
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirm_password && touched.confirm_password && (
          <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
        )}
      </div>

      {/* Submit Button */}
      <button 
        type="submit"
        className="bg-black text-white px-8 py-2 font-light mt-4 hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={Object.values(errors).some(error => error !== "") && Object.keys(touched).length > 0}
      >
        Reset Password
      </button>
    </form>
  );
};

export default ManagePassword;
