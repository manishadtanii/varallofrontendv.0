import React, { useState, useEffect } from "react";
import Arrow from "../../components/Arrow";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../services/apiService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  // Field States
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI States
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Passwords
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // const BASE_URL = "http://localhost:3000/api/auth";

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && step === 2) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
  };

  // STEP 1: Request OTP - Forgot Password
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/forgot-password/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("OTP sent to your email");
        localStorage.setItem("forgotPasswordEmail", email);
        localStorage.setItem("forgotPasswordToken", data.resetPasswordToken || "");
        setStep(2);
        startTimer();
      } else {
        setError(data.message || "Request failed");
        toast.error(data.message || "Request failed");
      }
    } catch (err) {
      setError("Network error occurred");
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/admin/forgot-password/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("OTP Verified! Set your new password");
        localStorage.setItem("resetPasswordToken", data.resetPasswordToken);
        setStep(3);
      } else {
        setError(data.message || "Invalid OTP");
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Verification failed");
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const resetPasswordToken = localStorage.getItem("resetPasswordToken");
      const response = await fetch(`${BASE_URL}/admin/forgot-password/reset`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resetPasswordToken}`
        },
        credentials: "include",
        body: JSON.stringify({ newPassword, confirmPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Password reset successfully!");
        localStorage.removeItem("resetPasswordToken");
        localStorage.removeItem("forgotPasswordEmail");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
      } else {
        setError(data.message || "Reset failed");
        toast.error(data.message || "Reset failed");
      }
    } catch (err) {
      setError("Reset failed");
      toast.error("Reset failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/admin/forgot-password/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("OTP resent to your email");
        setOtp("");
        startTimer();
      } else {
        setError(data.message || "Resend failed");
        toast.error(data.message || "Resend failed");
      }
    } catch (err) {
      setError("Network error occurred");
      toast.error("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen flex items-center justify-center py-[80px] px-[20px]">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row w-full max-w-[1400px] bg-[#0a0f14] rounded-3xl border border-gray-800 overflow-hidden">
        
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <h2 className="text-[36px] md:text-[47px] text-white font-manrope mb-2">
            {step === 3 ? "Set New Password" : "Forgot Password?"}
          </h2>
          <p className="text-gray-400 text-base md:text-xl mb-8 font-manrope">
            Step {step} of 3: {step === 1 ? "Enter Your Email" : step === 2 ? "Verify OTP" : "Create New Password"}
          </p>

          <form onSubmit={step === 1 ? handleRequestOTP : step === 2 ? handleVerifyOTP : handleResetPassword} className="space-y-6">
            
            {/* STEP 1: Email */}
            {step === 1 && (
              <div className="flex flex-col">
                <label className="block text-gray-400 text-base md:text-xl mb-2 ml-1 font-manrope">Admin Email</label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-full px-5 py-3 text-white focus:outline-none focus:border-cyan-400 font-manrope transition-all"
                  required
                />
              </div>
            )}

            {/* STEP 2: OTP */}
            {step === 2 && (
              <div className="flex flex-col">
                <label className="block text-gray-400 text-base md:text-xl mb-2 ml-1 font-manrope">Verification OTP</label>
                <p className="text-gray-500 text-sm mb-3">Check your email for the 6-digit code</p>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  className="w-full bg-transparent border border-gray-700 rounded-full px-5 py-3 text-white focus:outline-none focus:border-cyan-400 font-manrope transition-all"
                  required
                />
                {timer > 0 && (
                  <p className="text-gray-400 text-xs mt-2">Resend available in {timer}s</p>
                )}
              </div>
            )}

            {/* STEP 3: New Passwords */}
            {step === 3 && (
              <>
                <div className="flex flex-col">
                  <label className="block text-gray-400 text-base md:text-xl mb-2 ml-1 font-manrope">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-transparent border border-gray-700 rounded-full px-5 py-3 pr-12 text-white focus:outline-none focus:border-cyan-400 font-manrope transition-all"
                      placeholder="Min. 6 characters"
                      required
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showNew ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <label className="block text-gray-400 text-base md:text-xl mb-2 ml-1 font-manrope">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full bg-transparent border rounded-full px-5 py-3 text-white focus:outline-none font-manrope transition-all ${error ? "border-red-600" : "border-gray-700 focus:border-cyan-400"}`}
                      placeholder="Confirm password"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showConfirm ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && <p className="text-red-600 text-sm mt-2 ml-4 animate-pulse">{error}</p>}

            <button type="submit" disabled={loading} className={`main-btn flex font-manrope mt-6 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
              <div className="text bg-secondary text-white text-base lg:text-lg leading-10 py-1 px-10 rounded-[50px]">
                {loading ? "Processing..." : step === 3 ? "Reset Password" : "Next Step"}
              </div>
              <Arrow customClass="bg-secondary text-white -rotate-45" />
            </button>

            {/* Resend OTP Button */}
            {step === 2 && canResend && (
              <button 
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-manrope mt-2"
              >
                ↻ Resend OTP
              </button>
            )}
          </form>

          <button 
            onClick={() => navigate("/admin/login")} 
            className="text-gray-400 text-base md:text-lg block mt-8 hover:text-white transition-colors text-left font-manrope"
          >
            ← Back to Login
          </button>
        </div>

        <div className="hidden md:block w-1/2 p-4">
          <div className="h-full w-full rounded-2xl overflow-hidden relative">
            <img src="/adminlogin.png" alt="Branding" className="w-full object-cover h-full" />
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ForgotPassword;