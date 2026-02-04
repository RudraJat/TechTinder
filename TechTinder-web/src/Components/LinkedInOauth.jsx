import {useEffect} from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () =>{
    const navigate = useNavigate();

    useEffect(()=>{
        const token = new URLSearchParams(window.location.search).get("token");

        if(token){
            localStorage.setItem("token", token);
            alert("Welcome to TECHTINER! LinkedIn connected!");
            navigate("/")
        }
    }, []);
     return <p>Signing you in...</p>
};

export default OAuthSuccess;