import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FormLogin from "../../components/forms/FormLogin";

import reusemart from "../../assets/images/titlereuse.png";


const LoginPage = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const tokenDariSS = sessionStorage.getItem("token");
    setToken(tokenDariSS);
    
    if (tokenDariSS) {
      const userType = sessionStorage.getItem("user_type");

      if (userType) {
        navigate(`/${userType}`);
      }
      
    }
  }, [navigate]);

  return !token && (
    <Container className="mt-5">
    <div className="text-center mb-3 d-flex flex-row justify-content-center align-items-center gap-3">
      <img src={reusemart} alt="ReuseMart" />
      <h1 className="mt-1 pb-1 hijau" >L O G I N </h1>
    </div>

    <FormLogin />
  </Container>
  );
};

export default LoginPage;
