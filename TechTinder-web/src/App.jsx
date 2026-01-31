 
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Body from "./Components/Body";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import LandingPage from "./Pages/LandingPage";

import "./App.css";

function App() {
  
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
            <Route path='/' element={<LandingPage/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<Signup/>} />
        </Routes>
      </BrowserRouter>


      
    </>
  );
}

export default App;
