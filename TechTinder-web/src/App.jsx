 
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Body from "./Components/Body";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import OAuthSuccess from "./Components/LinkedInOauth";
import LandingPage from "./Pages/LandingPage";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";
import TechTinderHome from "./Pages/TechTinderHome";
import ProtectedRoute from "./Components/ProtectedRoute";

import "./App.css";


function App() {
  
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
            <Route path='/' element={<LandingPage/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<Signup/>} />
            <Route path='/oauth-success' element={<OAuthSuccess/>} />
            <Route path='/privacypolicy' element={<PrivacyPolicy/>} />
            <Route path='/terms' element={<TermsOfService/>} />
            <Route 
              path='/home' 
              element={
                <ProtectedRoute>
                  <TechTinderHome />
                </ProtectedRoute>
              } 
            />
        </Routes>
      </BrowserRouter>


      
    </>
  );
}

export default App;
