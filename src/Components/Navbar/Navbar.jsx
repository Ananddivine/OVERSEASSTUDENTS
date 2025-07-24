import React, { useState, useRef, useEffect } from 'react';
import navlogo from '../../assets/stem.jpg';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ Import useLocation
import axiosInstance from '../axiosInstance/axiosInstance';

const Navbar = ({ setToken }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ To detect current page
  const userEmail = localStorage.getItem('userEmail');

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/api/students/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfile(res.data.student);
        console.log("fetched profile data: ", res.data.student)
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setToken('');
    setDropdownOpen(false);
    navigate('/'); // Redirect to home or login after logout (optional)
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Handle navigation based on current page
  const handleProfileClick = () => {
    if (location.pathname === '/StudentProfile') {
      navigate('/StudentUploadForm'); // ✅ Go back to upload page
    } else {
      navigate('/StudentProfile'); // ✅ Go to profile page
    }
    setDropdownOpen(false);
  };

  return (
    <div className="relative flex items-center justify-between bg-red-600 shadow-md px-5 py-3">
      <img src={navlogo} alt="Logo" className="h-16 ml-20" />
      <div className="flex items-center space-x-6">
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center cursor-pointer space-x-2"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={profile?.profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-300 object-cover"
            />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 text-gray-200 bg-gray-900 border border-gray-200 shadow-lg rounded-md overflow-hidden z-50">
              <div className="p-3 border-b">
                <p className="text-sm font-semibold">{profile?.studentName || 'User'}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                   {location.pathname === '/StudentProfile' && (
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          )}        {userEmail}
                </p>
              </div>
              <div>
                <p
                  className="text-sm cursor-pointer hover:text-green-500 ml-1 px-1 py-2"
                  onClick={handleProfileClick}
                >
                  {location.pathname === '/StudentProfile'
                    ? 'GO BACK TO UPLOAD PROFILE'
                    : 'CLICK SEE YOUR PROFILE'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
