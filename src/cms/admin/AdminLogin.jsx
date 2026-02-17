import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import Arrow from "../../components/Arrow";
import { API_BASE_URL } from "../../services/apiService";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = API_BASE_URL;

  // Direct Login - No OTP flow
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/auth/admin/login/`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen flex items-center justify-center py-[80px] px-[20px]">
      <div className="flex flex-col md:flex-row w-full max-w-[1400px] bg-[#0a0f14] rounded-3xl border border-gray-800">
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <h2 className="text-[36px] md:text-[47px] text-white font-manrope">Get Started Now</h2>
          <p className="text-gray-400 text-base md:text-xl mb-8 font-manrope">
            Admin access portal. Enter your credentials to proceed.
          </p>

          <div className="space-y-6">
            {/* Admin Email Section */}
            <div className="flex flex-col">
              <label className="block text-gray-400 text-base md:text-xl mb-2 ml-1 font-manrope">Admin Email</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-transparent border rounded-full px-5 py-3 text-white focus:outline-none transition-all
                    ${error ? "border-red-600" : "border-gray-700 focus:border-cyan-400"}`}
                />
              </div>
              {error && <p className="text-red-600 text-xs mt-2 ml-4">{error}</p>}
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
              <label className="block text-gray-400 text-base md:text-xl mb-2 font-manrope">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-full px-5 py-3 text-white focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <HiOutlineEyeOff size={22} /> : <HiOutlineEye size={22} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/admin/forgot-password")}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-manrope transition-colors"
              >
                Forgot your password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className={`main-btn flex font-manrope ${
                loading || !email || !password ? "opacity-50 cursor-not-allowed" : "bg-cyan-400 text-black"
              }`}
            >
              <div className="text bg-secondary text-white text-base lg:text-lg leading-10 py-1 px-6 lg:leading-[40px] rounded-[50px]">
                {loading ? "Signing In..." : "Sign In"}
              </div>
              <Arrow customClass="bg-secondary text-white -rotate-45" />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:block w-1/2 p-4">
          <div className="h-full w-full rounded-2xl overflow-hidden relative">
            <img src="/adminlogin.png" alt="Branding" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;