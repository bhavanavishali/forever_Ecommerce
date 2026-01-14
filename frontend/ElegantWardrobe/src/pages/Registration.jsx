import React, { useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { USER_ACCESS_TOKEN, USER_REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
import OtpVerification from "../components/OtpVerification";
import { ClipLoader } from "react-spinners";
import { Eye, EyeOff } from "lucide-react";

const Registration = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password1: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateFirstName = (value) => {
    if (!value.trim()) return "First name is required";
    if (value.trim().length < 2) return "First name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "First name can only contain letters and spaces";
    return "";
  };

  const validateLastName = (value) => {
    if (!value.trim()) return "Last name is required";
    if (value.trim().length < 2) return "Last name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "Last name can only contain letters and spaces";
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePhoneNumber = (value) => {
    if (!value.trim()) return "Phone number is required";
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ""))) return "Please enter a valid phone number (10-15 digits)";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])/.test(value)) return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(value)) return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(value)) return "Password must contain at least one number";
    if (!/(?=.*[@$!%*?&])/.test(value)) return "Password must contain at least one special character (@$!%*?&)";
    return "";
  };

  const validateConfirmPassword = (value, password) => {
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return "";
  };

  // Real-time validation
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "first_name":
        error = validateFirstName(value);
        break;
      case "last_name":
        error = validateLastName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "phone_number":
        error = validatePhoneNumber(value);
        break;
      case "password1":
        error = validatePassword(value);
        // Also revalidate confirm password if it exists
        if (formData.password2) {
          setErrors(prev => ({
            ...prev,
            password2: validateConfirmPassword(formData.password2, value)
          }));
        }
        break;
      case "password2":
        error = validateConfirmPassword(value, formData.password1);
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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
    newErrors.first_name = validateFirstName(formData.first_name);
    newErrors.last_name = validateLastName(formData.last_name);
    newErrors.email = validateEmail(formData.email);
    newErrors.phone_number = validatePhoneNumber(formData.phone_number);
    newErrors.password1 = validatePassword(formData.password1);
    newErrors.password2 = validateConfirmPassword(formData.password2, formData.password1);
    
    setErrors(newErrors);
    setTouched({
      first_name: true,
      last_name: true,
      email: true,
      phone_number: true,
      password1: true,
      password2: true,
    });

    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== "");
  };

  const onHandleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateAllFields()) {
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    setLoading(true);
    try {
      // Send OTP request
      await api.post("/send-otp/", {
        email: formData.email,
        phone_number:formData.phone_number,
        password1:formData.password1,
        password2:formData.password2,
      });

      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (error) {
      if (error?.response?.data?.error){
        toast.error(error?.response?.data?.error)
      } else if (error?.response?.status === 404) {
        // Check if this is because API_BASE_URL is not set
        const requestUrl = error?.config?.url || error?.request?.responseURL;
        if (requestUrl?.includes('localhost:5173')) {
          console.error('API request went to frontend server instead of backend.');
          console.error('Please create a .env file with VITE_API_BASE_URL=http://localhost:8000');
          toast.error("Backend not configured. Please check your API settings.");
        } else {
          toast.error("Endpoint not found. Please check if backend is running.");
        }
      } else {
        console.log(error);
        toast.error("Error sending OTP. Please try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClass = "w-full px-3 py-2 border transition-colors duration-200";
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClass} border-red-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500`;
    } else if (touched[fieldName] && !errors[fieldName]) {
      return `${baseClass} border-green-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`;
    }
    return `${baseClass} border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`;
  };

  const getPasswordInputClassName = (fieldName) => {
    const baseClass = "w-full px-3 py-2 pr-10 border transition-colors duration-200";
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClass} border-red-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500`;
    } else if (touched[fieldName] && !errors[fieldName]) {
      return `${baseClass} border-green-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500`;
    }
    return `${baseClass} border-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`;
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <ClipLoader color="#000" size={40} />
        </div>
      ) : !otpSent ? (
        <form
          onSubmit={onHandleSubmit}
          className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
        >
          <div className="inline-flex items-center gap-2 mb-2 mt-10">
            <p className="prata-regular text-3xl">Sign Up</p>
            <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
          </div>

          {/* First Name */}
          <div className="w-full">
            <input
              className={getInputClassName("first_name")}
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.first_name && touched.first_name && (
              <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="w-full">
            <input
              className={getInputClassName("last_name")}
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.last_name && touched.last_name && (
              <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
            )}
          </div>

          {/* Email */}
          <div className="w-full">
            <input
              className={getInputClassName("email")}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="w-full">
            <input
              className={getInputClassName("phone_number")}
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.phone_number && touched.phone_number && (
              <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
            )}
          </div>

          {/* Password */}
          <div className="w-full">
            <div className="relative">
              <input
                className={getPasswordInputClassName("password1")}
                type={showPassword1 ? "text" : "password"}
                name="password1"
                placeholder="Password"
                value={formData.password1}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setShowPassword1(!showPassword1)}
              >
                {showPassword1 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password1 && touched.password1 && (
              <p className="text-red-500 text-sm mt-1">{errors.password1}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="w-full">
            <div className="relative">
              <input
                className={getPasswordInputClassName("password2")}
                type={showPassword2 ? "text" : "password"}
                name="password2"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password2 && touched.password2 && (
              <p className="text-red-500 text-sm mt-1">{errors.password2}</p>
            )}
          </div>

          <div className="w-full flex justify-between text-sm mt-[-8px]">
            <p className="cursor-pointer" onClick={() => { navigate('/login') }}>
              Login Here
            </p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="bg-black text-white px-8 py-2 font-light mt-4 hover:bg-gray-800 transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>
      ) : (
        <OtpVerification formData={formData} setOtpSent={setOtpSent} />
      )}
    </>
  );
};

export default Registration;
