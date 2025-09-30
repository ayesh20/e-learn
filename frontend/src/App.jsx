import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx"; // Ensure path is correct

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
import MyCourses from "./pages/MyCourses/MyCourses.jsx";
import Checkout from"./pages/Checkout/CheckoutPage.jsx";

// PrivateRoute wrapper
function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/" />;

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/OTPVerification" element={<OTPVerification />} />
          <Route path="/ResetConfirm" element={<ResetConfirm />} />
          <Route path="/SetNewPassword" element={<SetNewPassword />} />
          <Route path="/SuccessfulReset" element={<SuccessfulReset />} />

          {/* Protected routes */}
          <Route
            path="/Home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/InstructorDashboard"
            element={
              <PrivateRoute>
                <InstructorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/messaginginstructor1"
            element={
              <PrivateRoute>
                <MessagingInstructor1 />
              </PrivateRoute>
            }
          />
          <Route
            path="/messaginginstructor2"
            element={
              <PrivateRoute>
                <MessagingInstructor2 />
              </PrivateRoute>
            }
          />
          <Route
            path="/messagingstudent1"
            element={
              <PrivateRoute>
                <MessagingStudent1 />
              </PrivateRoute>
            }
          />
          <Route
            path="/messagingstudent2"
            element={
              <PrivateRoute>
                <MessagingStudent2 />
              </PrivateRoute>
            }
          />
           <Route path="/course-details/:courseId"
            element={
              <PrivateRoute>
                <CourseDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/LectureOverview"
            element={
              <PrivateRoute>
                <LectureOverview />
              </PrivateRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <PrivateRoute>
                <Courses />
              </PrivateRoute>
            }
          />
          <Route
            path="/mycourses"
            element={
              <PrivateRoute>
                <MyCourses />
              </PrivateRoute>
            }
          />
          <Route
            path="/profileedit"
            element={
              <PrivateRoute>
                <ProfileEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/aboutus"
            element={
              <PrivateRoute>
                <Aboutus />
              </PrivateRoute>
            }
          />
          <Route
            path="/contactus"
            element={
              <PrivateRoute>
                <Contactus />
              </PrivateRoute>
            }
          />
          <Route
            path="/course-overview/:courseId" // <-- Correct dynamic route path
            element={
              <PrivateRoute>
                <CourseOverview />
              </PrivateRoute>
            }
          />
          <Route 
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout/>
            </PrivateRoute>
          }
          />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          />
          <Route
            path="/quizstudent"
            element={
              <PrivateRoute>
                <QuizStudent />
              </PrivateRoute>
            }
          />
          <Route
            path="/quizinstructor"
            element={
              <PrivateRoute>
                <QuizInstructor />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;