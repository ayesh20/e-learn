import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Signup/Signup.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import OTPVerification from './pages/OTPVerification/OTPVerification'
import ResetConfirm from './pages/ResetConfirm/ResetConfirm'
import SetNewPassword from './pages/SetNewPassword/SetNewPassword'
import SuccessfulReset from './pages/SuccessfulReset/SuccessfulReset'
import InstructorDashboard from './pages/InstructorDashboard/InstructorDashboard'
import CourseDetails from "./pages/courseDetails/courseDetails.jsx";
import LectureOverview from './pages/LectureOverview/LectureOverview'




function App() {
  return (
    <BrowserRouter>
   
        <Routes>
         <Route path="/"  element={<HomePage/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/course-details" element={<CourseDetails/>} />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/OTPVerification" element={<OTPVerification />} />
          <Route path="/ResetConfirm" element={<ResetConfirm />} />
          <Route path="/SetNewPassword" element={<SetNewPassword />} />
          <Route path="/SuccessfulReset" element={<SuccessfulReset />} />
          <Route path="/InstructorDashboard" element={<InstructorDashboard />} />
          <Route path="/LectureOverview" element={<LectureOverview />} />

          
        </Routes>
     
    </BrowserRouter>
  );
}

export default App;