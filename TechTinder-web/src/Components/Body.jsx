import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; 
import Footer from "./Footer";
import Login from "../Pages/Login";

function Body() {
  return (
    <div>
        {/* <Navbar/> */}
        {/* Outlet - any children routes of body will render over here */}
        <Outlet/> 
        {/* <Footer/> */}
        
        
    </div>
  )
}

export default Body;