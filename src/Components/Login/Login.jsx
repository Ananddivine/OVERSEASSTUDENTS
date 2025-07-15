import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../axiosInstance/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
 const navigate = useNavigate();
  useEffect(() => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    const currentTime = new Date().getTime();
    if (expirationTime && currentTime > expirationTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('tokenExpiration');
      setToken('');
    }
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/students/login', { email, password });

      if (response.data.success) {
        const token = response.data.token;
        const uniqToken = response.data.uniqToken; // No hashing needed

        // Store values in localStorage
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('uniqToken', uniqToken); // Store raw uniqToken

        // Set token expiration (12 hours)
        const expirationTime = new Date().getTime() + 12 * 60 * 60 * 1000;
        localStorage.setItem('tokenExpiration', expirationTime);

        toast.success('Login Successful');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handelOnClick = () =>{
    navigate('/ForgotPassword')
  }
  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-r from-purple-800 via-purple-800 font-poppins">

      <div className="flex flex-col justify-center w-1/3 p-8">
          <h2 className="text-3xl font-bold text-white">Welcome</h2>
          <h2 className="text-3xl font-bold text-white"><span className='text-red-200'></span><span className='text-green-500'>STEM EDUCATION</span> </h2>
          <p className="text-gray-100 mt-2">
         OVERSEAS STUDENTS
          </p>
        </div>
      <div className='bg-violet-950 shadow-md rounded-lg px-8 py-6 max-w-md ml-40'>
        <h1 className='text-2xl font-bold mb-4 text-gray-100'>Login</h1>
        <form onSubmit={onSubmitHandler}>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-200 mb-2'>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
              type='email'
              placeholder='Email id'
              name='email'
              required
            />
          </div>
          <div>
            <p className='text-sm font-medium text-gray-200 mb-2'>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none'
              type='password'
              placeholder='Password'
              name='password'
              required
            />
          </div>
          <button
            className='mt-2 w-full px-4 py-2 rounded-md text-white bg-purple-700 flex items-center justify-center'
            type='submit'
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
            ) : null}
            Submit
          </button>
        </form>
              <p onClick={handelOnClick} className='pt-1 text-xl text-red-300 cursor-pointer'>Forgot Password</p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
