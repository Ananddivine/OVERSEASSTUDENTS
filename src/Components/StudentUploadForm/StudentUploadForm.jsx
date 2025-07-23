import React, { useState } from 'react';
import axiosInstance from '../axiosInstance/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bgSnow from '../../assets/bg-snow.jpg';

const StudentUploadForm = () => {
  const [form, setForm] = useState({
    studentName: '',
    age: '',
    gender: '',
    contactNumbers: [''],
    accountNumber: '',
    confirmAccountNumber: '',
    branchName: '',
    universityName: '',
    countryName: '',
    currentEmail: '',
  });

  const [files, setFiles] = useState({
    passport: null,
    passportPhoto: null,
    stemCertificate: null,
    usscCertificate: null,
    offerLetters: [],
    bills: [],
    nid: null,
  });

  const token = localStorage.getItem('token');

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContactChange = (index, value) => {
    const updatedContacts = [...form.contactNumbers];
    updatedContacts[index] = value;
    setForm({ ...form, contactNumbers: updatedContacts });
  };

  const addContactField = () => {
    setForm({ ...form, contactNumbers: [...form.contactNumbers, ''] });
  };

  const handleFileChange = (e, type, multiple = false) => {
    if (multiple) {
      setFiles({ ...files, [type]: Array.from(e.target.files) });
    } else {
      setFiles({ ...files, [type]: e.target.files[0] });
    }
  };

  const uploadSingleFile = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const res = await axiosInstance.post('/api/students/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.fileUrl;
  };

  const uploadMultipleFiles = async (fileList, type) => {
    const urls = [];
    for (let file of fileList) {
      const url = await uploadSingleFile(file, type);
      urls.push(url);
    }
    return urls;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (form.accountNumber !== form.confirmAccountNumber) {
    return toast.error('Account numbers do not match');
  }

  try {
    const uploadedData = {};
    for (let key in files) {
      if (files[key]) {
        if (Array.isArray(files[key])) {
          uploadedData[key] = await uploadMultipleFiles(files[key], key);
        } else {
          uploadedData[key] = await uploadSingleFile(files[key], key);
        }
      }
    }

    const payload = {
      ...form,
      ...uploadedData,
    };

    await axiosInstance.put('/api/students/update-profile', payload, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ FIXED
      },
    });

    toast.success('Profile and files uploaded successfully!');
  } catch (err) {
    toast.error('Upload failed');
    console.error('Update Profile Error:', err);
  }
};


  return (
    <div className="min-h-screen py-10 px-40 bg-cover bg-center bg-fixed brightness-75" style={{ backgroundImage: `url(${bgSnow})` }}
>
   <div className="max-w-6xl rounded-xl shadow-lg p-8 bg-white/30 backdrop-blur-md border border-white/40">
        <h2 className="text-3xl font-bold text-white mb-8">
          Student Document Upload
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT SIDE: PERSONAL DETAILS */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Personal Information
            </h3>

            <input
              type="text"
              name="studentName"
              placeholder="Full Name"
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-blue-500"
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-blue-500"
            />
            <select
              name="gender"
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-blue-500"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="email"
              name="currentEmail"
              placeholder="Update Email (optional)"
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-blue-500"
            />

            <h3 className="text-lg font-semibold text-gray-100 mt-4">
              Contact Numbers
            </h3>
            {form.contactNumbers.map((num, index) => (
              <input
                key={index}
                type="text"
                value={num}
                onChange={(e) => handleContactChange(index, e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-blue-500 mb-2"
              />
            ))}
            <button
              type="button"
              onClick={addContactField}
              className="text-white text-sm hover:text-black"
            >
              + Add another contact
            </button>

            <h3 className="text-xl font-semibold text-gray-100 mt-4">
              Bank & University Info
            </h3>
            <input
              type="text"
              name="accountNumber"
              placeholder="Account Number"
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-blue-500"
            />
            <input
              type="text"
              name="confirmAccountNumber"
              placeholder="Confirm Account Number"
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-blue-500"
            />
            <input
              type="text"
              name="branchName"
              placeholder="Branch Name"
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-blue-500"
            />
            <input
              type="text"
              name="universityName"
              placeholder="University Name"
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-blue-500"
            />
            <input
              type="text"
              name="countryName"
              placeholder="Country Name"
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2 focus:outline-blue-500"
            />
          </div>

          {/* RIGHT SIDE: FILE UPLOADS */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Upload Documents
            </h3>

            {/* Example of Photo Upload Box */}
            {[
              { label: 'profilepic', type: 'profilepic' },
              { label: 'Passport', type: 'passport' },
              { label: 'Passport Photo', type: 'passportPhoto' },
              { label: 'STEM Certificate', type: 'stemCertificate' },
              { label: 'USSC Certificate', type: 'usscCertificate' },
              { label: 'NID', type: 'nid' },
            ].map((item, index) => (
              <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
                <label className="block text-gray-100 font-medium mb-2">
                  {item.label}
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, item.type)}
                  className="w-full text-sm text-gray-00 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            ))}

            {/* Multiple File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
              <label className="block text-gray-100 font-medium mb-2">
                Offer Letters (Multiple)
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(e, 'offerLetters', true)}
                className="w-full text-sm text-gray-00 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition">
              <label className="block text-gray-100 font-medium mb-2">
                Bills (Multiple)
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => handleFileChange(e, 'bills', true)}
                className="w-full text-sm text-gray-00 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentUploadForm;
