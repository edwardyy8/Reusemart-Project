import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FormLupaPass from "../../components/forms/FormLupaPass";

import reusemart from "../../assets/images/titlereuse.png";


const LupaPassPage = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const tokenDariSS = sessionStorage.getItem("token");
    setToken(tokenDariSS);
    
  }, []);

  return (
    <Container className="mt-5">
      <div className="text-center mb-3 d-flex flex-row justify-content-center align-items-center gap-3">
          <img src={reusemart} alt="ReuseMart" />
          <div className="d-flex flex-column justify-content-center text-start">
            <h1 className="mt-1 pb-1 hijau text-start" >L U P A </h1>
            <h1 className="mt-1 pb-1 hijau text-start" >K A T A S A N D I </h1>
          </div>
      </div>

      <FormLupaPass />
    
  </Container>
  );
};

export default LupaPassPage;
