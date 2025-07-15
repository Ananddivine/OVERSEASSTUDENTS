import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ForgotPassword from '../../Components/Login/ForgotPassword';
import StudentUploadForm from '../../Components/StudentUploadForm/StudentUploadForm';
import StudentProfile from '../../Components/StudentProfile/StudentProfile';


const Admin = () => {

  return (
    <div className="flex">
   
      


      <div>
        <Routes>        
          <Route path="/ForgotPassword" element={<ForgotPassword />} />    
          <Route path="/StudentProfile" element={<StudentProfile />} />       
          <Route path="/StudentUploadForm" element={<StudentUploadForm />} />          
                   
          <Route path="*" element={<Navigate to="StudentUploadForm" />} />

        </Routes>
      </div>
      
    </div>
  );
};

export default Admin;
