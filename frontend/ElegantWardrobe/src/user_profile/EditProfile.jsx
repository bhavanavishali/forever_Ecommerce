import api from '@/api';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
    });

    const [oldEmail, setOldEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    // Timer effect for OTP resend
    useEffect(() => {
        let interval;
        if (otpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer, otpSent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // For phone number, only allow digits and limit to 10 characters
        if (name === 'phone_number') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 10) {
                setFormData({ ...formData, [name]: numericValue });
            }
        } else if (name === 'first_name' || name === 'last_name') {
            // For names, filter out numbers and special characters (except space, hyphen, apostrophe)
            const filteredValue = value.replace(/[^A-Za-z\s\-']/g, '');
            // Limit to 50 characters and prevent consecutive spaces
            const cleanedValue = filteredValue.slice(0, 50).replace(/\s+/g, ' ');
            setFormData({ ...formData, [name]: cleanedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateName = (name, fieldName) => {
        const trimmedName = name.trim();
        
        if (!trimmedName) {
            return `${fieldName} is required`;
        }
        
        // Check minimum length (2 characters)
        if (trimmedName.length < 2) {
            return `${fieldName} must be at least 2 characters long`;
        }
        
        // Check maximum length (50 characters)
        if (trimmedName.length > 50) {
            return `${fieldName} must not exceed 50 characters`;
        }
        
        // Must start with a letter
        if (!/^[A-Za-z]/.test(trimmedName)) {
            return `${fieldName} must start with a letter`;
        }
        
        // No numbers allowed
        if (/\d/.test(trimmedName)) {
            return `${fieldName} cannot contain numbers`;
        }
        
        // Only alphabetic characters, spaces, hyphens, and apostrophes allowed
        if (!/^[A-Za-z\s\-']+$/.test(trimmedName)) {
            return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
        }
        
        // No consecutive spaces
        if (/\s{2,}/.test(trimmedName)) {
            return `${fieldName} cannot contain consecutive spaces`;
        }
        
        return null;
    };

    const validateForm = () => {
        const newErrors = {};
        
        // First name validation
        const firstNameError = validateName(formData.first_name, 'First name');
        if (firstNameError) {
            newErrors.first_name = firstNameError;
        }
        
        // Last name validation
        const lastNameError = validateName(formData.last_name, 'Last name');
        if (lastNameError) {
            newErrors.last_name = lastNameError;
        }
        
        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        // Phone number validation - must be exactly 10 digits
        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Phone number must be exactly 10 digits';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fix the validation errors");
            return;
        }
        
        setIsSubmitting(true);
        
        // Trim names before validation and submission
        const trimmedFormData = {
            ...formData,
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
        };

        if (trimmedFormData.email !== oldEmail) {
            setLoading(true);
            try {
                const res = await api.post("/send-otp/", {
                    email: trimmedFormData.email,
                });
                setFormData(trimmedFormData); // Update state with trimmed data
                setOtpSent(true);
                setTimer(60);
                setCanResend(false);
                setOtp("");
                toast.success("OTP sent to your new email address");
            } catch (error) {
                toast.error(error?.response?.data?.error);
            } finally {
                setLoading(false);
                setIsSubmitting(false);
            }
        } else {
            setOtpSent(false);
            try {
                const res = await api.put(`/edit_user_profile/`, trimmedFormData);
                if (res.status === 200) {
                    toast.success("Profile Updated Successfully");
                    setFormData(trimmedFormData); // Update state with trimmed data
                } else {
                    toast.error("Profile Update Failed");
                }
            } catch (error) {
                console.log(error.message);
                toast.error(error?.response?.data?.error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp.trim()) {
            toast.info("Please enter OTP");
            return;
        }

        if (otp.length !== 6) {
            toast.error("OTP must be 6 digits");
            return;
        }

        setIsVerifying(true);
        try {
            const response = await api.post("/verify-otp/", {
                email: formData.email,
                otp: otp,
            });

            if (response.data.message === "OTP verified successfully") {
                setOtpSent(false);
                toast.success("OTP verified successfully");
                try {
                    const res = await api.put(`/edit_user_profile/`, {
                        ...formData,
                        first_name: formData.first_name.trim(),
                        last_name: formData.last_name.trim(),
                    });
                    if (res.status === 200) {
                        toast.success("Profile Updated Successfully");
                        setOldEmail(formData.email); // Update old email after successful update
                        // Update form data with trimmed values
                        setFormData(prev => ({
                            ...prev,
                            first_name: prev.first_name.trim(),
                            last_name: prev.last_name.trim(),
                        }));
                    } else {
                        toast.error("Profile Update Failed");
                    }
                } catch (error) {
                    console.log(error.message);
                    toast.error("Profile Update Failed");
                }
            }
        } catch (error) {
            toast.error("Invalid OTP! Try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResend) return;
        
        setIsResending(true);
        try {
            await api.post("/send-otp/", {
                email: formData.email
            });
            
            toast.success("OTP sent successfully!");
            setTimer(60);
            setCanResend(false);
            setOtp("");
        } catch (error) {
            toast.error("Failed to resend OTP. Please try again.");
        } finally {
            setIsResending(false);
        }
    };

    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const getUsersData = async () => {
            try {
                const res = await api.get(`/edit_user_profile/`);
                setFormData(res.data);
                setOldEmail(res.data.email);
            } catch (error) {
                console.log(error.message);
            }
        };
        getUsersData();
    }, []);

    return (
        <>
            {loading ? (
                <div className="w-full h-screen flex items-center justify-center">
                    <ClipLoader color="#000" size={40} />
                </div>
            ) : !otpSent ? (
                <form
                    onSubmit={onHandleSubmit}
                    className="flex flex-col items-center w-full max-w-md mx-auto px-4 sm:px-6 mt-8 sm:mt-14 gap-4 text-gray-800"
                >
                    <div className="inline-flex items-center gap-2 mb-2 mt-6 sm:mt-10">
                        <p className="prata-regular text-2xl sm:text-3xl">Edit Profile</p>
                        <hr className="border-none h-[1.5px] w-6 sm:w-8 bg-gray-800" />
                    </div>

                    {/* First Name */}
                    <div className="w-full">
                        <input
                            className={`w-full px-3 py-2 border ${errors.first_name ? 'border-red-500' : 'border-gray-800'} focus:outline-none focus:border-gray-600`}
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                        {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                    </div>

                    {/* Last Name */}
                    <div className="w-full">
                        <input
                            className={`w-full px-3 py-2 border ${errors.last_name ? 'border-red-500' : 'border-gray-800'} focus:outline-none focus:border-gray-600`}
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                        {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                    </div>

                    {/* Email */}
                    <div className="w-full">
                        <input
                            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-800'} focus:outline-none focus:border-gray-600`}
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        {formData.email !== oldEmail && formData.email && (
                            <p className="text-blue-600 text-sm mt-1">
                                ⚠️ Changing email will require OTP verification
                            </p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="w-full">
                        <input
                            className={`w-full px-3 py-2 border ${errors.phone_number ? 'border-red-500' : 'border-gray-800'} focus:outline-none focus:border-gray-600`}
                            type="tel"
                            name="phone_number"
                            placeholder="Phone Number (10 digits)"
                            value={formData.phone_number}
                            onChange={handleChange}
                            maxLength="10"
                        />
                        {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full sm:w-auto bg-black text-white px-8 py-2 font-light mt-4 transition-opacity ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                        }`}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            ) : (
                // OTP Verification UI (matching OtpVerification.jsx style)
                <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                    <div className="w-full max-w-md space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-semibold">Verify Your New Email</h1>
                            <p className="text-gray-400 text-sm">
                                We've sent a verification code to<br />
                                <span className="text-white font-medium">{formData.email}</span>
                            </p>
                        </div>

                        {/* OTP Form */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300 text-center">
                                    Enter 6-digit code
                                </label>
                                <input
                                    type="text"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    maxLength="6"
                                    className="w-full max-w-[200px] mx-auto block px-4 py-3 text-center text-xl font-mono bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-20 transition-colors"
                                    required
                                />
                            </div>

                            {/* Timer and Resend */}
                            <div className="text-center space-y-3">
                                {!canResend ? (
                                    <p className="text-sm text-gray-400">
                                        Resend code in <span className="font-mono text-white">{formatTimer(timer)}</span>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={isResending}
                                        className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50 underline"
                                    >
                                        {isResending ? "Sending..." : "Resend OTP"}
                                    </button>
                                )}
                            </div>

                            {/* Verify Button */}
                            <button
                                type="button"
                                onClick={handleVerifyOtp}
                                disabled={otp.length !== 6 || isVerifying}
                                className="w-full px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20"
                            >
                                {isVerifying ? "Verifying..." : "Verify Code"}
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                Didn't receive the code? Check your spam folder or{' '}
                                <button 
                                    onClick={() => setOtpSent(false)}
                                    className="text-white hover:underline"
                                >
                                    go back
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditProfile;