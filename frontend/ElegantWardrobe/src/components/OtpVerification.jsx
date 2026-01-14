import api from "@/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import api from '../api'

const OtpVerification = ({ formData, setOtpSent }) => {
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [timer, setTimer] = useState(60); // 1 minute timer
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate()

  // Timer effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (verified && registered) {
      // Replace with your navigation logic
      console.log("Registration successful, redirecting to login...");
    }
  }, [verified, registered]);

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.info("Please enter OTP");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await api.post("/verify-otp/", {
        email: formData.email,
        otp: otp,
      });

      if (response.data.message === "OTP verified successfully") {
        setVerified(true);
        await handleRegisterUser();
        console.log('OTP verified successfully');
      }
    } catch (error) {
      console.log(error);
      
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
      setTimer(60); // Reset timer
      setCanResend(false);
      setOtp(""); // Clear current OTP
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleRegisterUser = async () => {
    try {
      await api.post("/register/", formData);
      setRegistered(true);
      toast.success("Registration successful!");
    } catch (error) {
      if (error?.response?.data?.email) {
        toast.error(error?.response?.data?.email[0]);
      } else if (error?.response?.data?.phone_number) {
        toast.error(error?.response?.data?.phone_number[0]);
      } else {
        toast.error(error.message);
      }
      setOtpSent(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {!verified ? (
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold">Verify Your Email</h1>
            <p className="text-gray-400 text-sm">
              We've sent a verification code to<br />
              <span className="text-white font-medium">{formData?.email || "your email"}</span>
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
      ) : (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Verification Complete!</h2>
          <p className="text-gray-400">Redirecting you to login...</p>
          <button onClick={()=>{navigate('/login')}} className="outline px-4 py-1 rounded-sm">Login</button>
        </div>
      )
      }
    </div>
  );
};

export default OtpVerification;

