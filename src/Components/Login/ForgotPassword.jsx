import React, { useState } from 'react';
import axiosInstance from '../axiosInstance/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('request'); // 'request', 'verify', 'reset'
   const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRequestEmail = async (e) => {
      e.preventDefault();
      setLoading(true);
    if (!email) {
      toast.error('Please enter your email!');
      return;
    }
    try {
      await axiosInstance.post('/api/forgot-password/request-otp', { email });
      setStep('verify');
      toast.success('OTP sent to your email.');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error sending OTP.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
      e.preventDefault();
      setLoading(true);
    if (!otp) {
      toast.error('Please enter OTP.');
      return;
    }
    try {
      await axiosInstance.post('/api/forgot-password/verify-otp', { email, otp });
      setStep('reset');
      toast.success('OTP verified. Please enter a new password.');
    } catch (err) {
      toast.error('Invalid OTP.');
    }finally{
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
      e.preventDefault();
      setLoading(true);
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    try {
      await axiosInstance.post('/api/forgot-password/reset-password', { email, newPassword });
      toast.success('Password reset successfully.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error('Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          {step === 'request' && 'Forgot Password'}
          {step === 'verify' && 'Verify OTP'}
          {step === 'reset' && 'Reset Password'}
        </h2>

        {step === 'request' && (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
  onClick={handleRequestEmail}
  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
  disabled={loading}
>
  {loading ? (
    <>
      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
      <span>Sending...</span>
    </>
  ) : (
    'Send OTP'
  )}
</button>

          </>
        )}

        {step === 'verify' && (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
           <button
  onClick={handleVerifyOtp}
  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition flex items-center justify-center"
  disabled={loading}
>
  {loading ? (
    <>
      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
      <span>Verifying...</span>
    </>
  ) : (
    'Verify OTP'
  )}
</button>

          </>
        )}

        {step === 'reset' && (
          <>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
  onClick={handleResetPassword}
  className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition flex items-center justify-center"
  disabled={loading}
>
  {loading ? (
    <>
      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
      <span>Resetting...</span>
    </>
  ) : (
    'Reset Password'
  )}
</button>

          </>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ForgotPassword;
