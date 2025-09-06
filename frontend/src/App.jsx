import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Signup/Signup.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
// import HomePage from "./pages/Home/HomePage.jsx";



function App() {
  return (
    <BrowserRouter>
   
        <Routes>
         <Route path="/"  element={<HomePage/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        
          
        </Routes>
     
    </BrowserRouter>
  );
}

export default App;