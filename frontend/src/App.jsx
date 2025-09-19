import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Signup/Signup.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import OTPVerification from './pages/OTPVerification/OTPVerification';
import ResetConfirm from './pages/ResetConfirm/ResetConfirm';
import SetNewPassword from './pages/SetNewPassword/SetNewPassword';
import SuccessfulReset from './pages/SuccessfulReset/SuccessfulReset';
import InstructorDashboard from './pages/InstructorDashboard/InstructorDashboard';
import CourseDetails from "./pages/courseDetails/courseDetails.jsx";
import LectureOverview from './pages/LectureOverview/LectureOverview';
import ProfileEdit from './pages/ProfileEdit/ProfileEdit';
import Aboutus from "./pages/AboutUs/Aboutus";
import Contactus from "./pages/ContactUs/Contactus";
import MessagingInstructor1 from "./pages/MessagingInstructor/MessagingInstructor1";
import MessagingInstructor2 from "./pages/MessagingInstructor/MessagingInstructor2";
import MessagingStudent1 from "./pages/MessagingStudent/MessagingStudent1";
import MessagingStudent2 from "./pages/MessagingStudent/MessagingStudent2";
import CourseOverview from "./pages/CourseOverview/CourseOverview";
import AdminLayout from "./pages/admin/adminpage.jsx";
import QuizStudent from "./pages/QuizStudent/quizStudent.jsx";
import QuizInstructor from "./pages/quizInstructor/quizInstructor.jsx";
import Courses from "./pages/Courses/Courses.jsx";





function App() {
  return (
    <BrowserRouter>
   
        <Routes>
         <Route path="/"  element={<Login/>}/>
          <Route path="/Home" element={<HomePage/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/course-details" element={<CourseDetails/>} />
          
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/OTPVerification" element={<OTPVerification />} />
          <Route path="/ResetConfirm" element={<ResetConfirm />} />
          <Route path="/SetNewPassword" element={<SetNewPassword />} />
          <Route path="/SuccessfulReset" element={<SuccessfulReset />} />
          <Route path="/InstructorDashboard" element={<InstructorDashboard />} />
          <Route path="/LectureOverview" element={<LectureOverview />} />
          <Route path="/courses" element={<Courses/>} />




         <Route path="/profileedit"  element={<ProfileEdit/>}/>
         <Route path="/aboutus"  element={<Aboutus/>}/>
         <Route path="/contactus"  element={<Contactus/>}/>
         <Route path="/messaginginstructor1"  element={<MessagingInstructor1/>}/>
         <Route path="/messaginginstructor2"  element={<MessagingInstructor2/>}/>
         <Route path="/messagingstudent1"  element={<MessagingStudent1/>}/>
         <Route path="/messagingstudent2"  element={<MessagingStudent2/>}/>
         <Route path="/courseoverview"  element={<CourseOverview/>}/>
          <Route path="/admin/*" element={<AdminLayout/>}/>
          <Route path="/quizstudent" element={<QuizStudent/>}/>
          <Route path="/quizinstructor" element={<QuizInstructor/>}/>

          
        </Routes>
     
    </BrowserRouter>
  );
}

export default App;
