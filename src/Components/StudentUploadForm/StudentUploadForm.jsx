import React, { useState } from 'react';
import axiosInstance from '../axiosInstance/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentUploadForm = () => {
  const [form, setForm] = useState({
    name: '',
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

  const token = localStorage.getItem('token')

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
      headers: { 'Content-Type': 'multipart/form-data',  Authorization: `Bearer ${token}` },
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
      // Upload files first
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

      // Combine everything
      const payload = {
        ...form,
        ...uploadedData,
      };

      await axiosInstance.put('/api/students/update-profile', payload);
      toast.success('Profile and files uploaded successfully!');
    } catch (err) {
      toast.error('Upload failed');
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Student Document Upload</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Full Name" onChange={handleInputChange} className="input" />
          <input type="number" name="age" placeholder="Age" onChange={handleInputChange} className="input" />
          <select name="gender" onChange={handleInputChange} className="input">
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input type="email" name="currentEmail" placeholder="Update Email (optional)" onChange={handleInputChange} className="input" />
          <input type="text" name="accountNumber" placeholder="Account Number" onChange={handleInputChange} className="input" />
          <input type="text" name="confirmAccountNumber" placeholder="Confirm Account Number" onChange={handleInputChange} className="input" />
          <input type="text" name="branchName" placeholder="Branch Name" onChange={handleInputChange} className="input" />
          <input type="text" name="universityName" placeholder="University Name" onChange={handleInputChange} className="input" />
          <input type="text" name="countryName" placeholder="Country Name" onChange={handleInputChange} className="input" />
        </div>

        <div>
          <label className="block font-medium mb-2">Contact Numbers</label>
          {form.contactNumbers.map((num, index) => (
            <input key={index} type="text" className="input mb-2" value={num} onChange={(e) => handleContactChange(index, e.target.value)} />
          ))}
          <button type="button" onClick={addContactField} className="text-blue-500 hover:underline text-sm">+ Add another</button>
        </div>

        {/* File Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <input type="file" onChange={(e) => handleFileChange(e, 'passport')} className="file-input" />
          <input type="file" onChange={(e) => handleFileChange(e, 'passportPhoto')} className="file-input" />
          <input type="file" onChange={(e) => handleFileChange(e, 'stemCertificate')} className="file-input" />
          <input type="file" onChange={(e) => handleFileChange(e, 'usscCertificate')} className="file-input" />
          <input type="file" onChange={(e) => handleFileChange(e, 'nid')} className="file-input" />
          <input type="file" multiple onChange={(e) => handleFileChange(e, 'offerLetters', true)} className="file-input" />
          <input type="file" multiple onChange={(e) => handleFileChange(e, 'bills', true)} className="file-input" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Submit
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default StudentUploadForm;
