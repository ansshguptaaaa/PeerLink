'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSendOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter a valid email address first.');
      return;
    }
    setOtpLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/send-otp`, { email });
      setOtpSent(true);
      setSuccess('OTP sent successfully to your email.');
    } catch (err: any) {
      console.error('Send OTP error:', err);
      const msg = err.response?.data?.error || 'Failed to send OTP. Please try again.';
      setError(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    setOtpLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verify-otp`, { email, otp });
      setEmailVerified(true);
      setSuccess('Email verified successfully!');
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      const msg = err.response?.data?.error || 'Invalid or expired OTP. Please try again.';
      setError(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/signup`,
        { username, email, password }
      );
      
      const { accessToken, refreshToken, email: userEmail, role } = response.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('userRole', role);

      router.push('/');
    } catch (err: any) {
      console.error('Signup error:', err);
      const msg = err.response?.data?.error || 'Registration failed. Please check details and try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight mb-2">
              PeerLink
            </h1>
          </Link>
          <p className="text-sm text-slate-400">Get started today by creating a secure account.</p>
        </div>

        {/* Form container */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-8 shadow-2xl shadow-blue-950/10">
          <h2 className="text-xl font-bold text-white mb-6">Create your account</h2>

          {error && (
            <div id="signup-error" className="mb-6 p-4 rounded-lg bg-red-950/30 border border-red-800/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div id="signup-success" className="mb-6 p-4 rounded-lg bg-emerald-950/30 border border-emerald-800/50 text-emerald-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label htmlFor="signup-username" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <FiUser className="w-5 h-5" />
                </div>
                <input
                  id="signup-username" autoComplete="off"
                  type="text"
                  required
                  placeholder=""
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    id="signup-email"
                    type="email" autoComplete="off"
                    required
                    placeholder=""
                    value={email}
                    disabled={emailVerified}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailVerified || otpSent) {
                        setEmailVerified(false);
                        setOtpSent(false);
                        setOtp('');
                        setSuccess('');
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                {!emailVerified && (
                  <button
                    type="button"
                    id="send-otp-btn"
                    onClick={handleSendOtp}
                    disabled={otpLoading || !email}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition duration-200 flex items-center justify-center min-w-[100px]"
                  >
                    {otpLoading && !otpSent ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                )}
              </div>
              
              {emailVerified && (
                <div id="email-verified-badge" className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/50 border border-emerald-800/80 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ✓ Email Verified
                </div>
              )}
            </div>

            {otpSent && !emailVerified && (
              <div>
                <label htmlFor="signup-otp" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Enter OTP
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="signup-otp"
                      type="text"
                      required
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    id="verify-otp-btn"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || !otp}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 disabled:opacity-50 text-white font-medium rounded-xl text-sm transition duration-200 flex items-center justify-center min-w-[100px]"
                  >
                    {otpLoading && otpSent ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <FiLock className="w-5 h-5" />
                </div>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 text-sm"
                />
                <button
                  type="button"
                  id="toggle-signup-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              id="signup-submit-btn"
              type="submit"
              disabled={!emailVerified || isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Register
                  <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


