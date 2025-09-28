import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ForgotPassword from '../../Components/Login/ForgotPassword';
import StudentUploadForm from '../../Components/StudentUploadForm/StudentUploadForm';
import StudentProfile from '../../Components/StudentProfile/StudentProfile';
import StudentTasks from '../../Components/Tasks/StudentTasks';
import ShowTask from '../../Components/Tasks/ShowTask';
import StudentRequests from '../../Components/StudentRequests/StudentRequests';


const Admin = () => {

  return (
    <div className="flex">
   
      


      <div>
        <Routes>        
          <Route path="/ForgotPassword" element={<ForgotPassword />} />    
          <Route path="/StudentProfile" element={<StudentProfile />} />       
          <Route path="/StudentUploadForm" element={<StudentUploadForm />} />          
          <Route path="/StudentTasks" element={<StudentTasks />} />          
         <Route path="/ShowTask/:taskId" element={<ShowTask />} /> 
         <Route path="/StudentRequests" element={<StudentRequests />} /> 
                   
          <Route path="*" element={<Navigate to="StudentUploadForm" />} />

        </Routes>
      </div>
      
    </div>
  );
};

export default Admin;
