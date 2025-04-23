import { Container, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import FormLogin from "../../components/forms/FormLogin";

import reusemart from "../../assets/images/titlereuse.png";

import { getRole, getJabatan } from "../../api/apiAuth";

import LoadingPage from "../../components/LoadingPage";

const LoginPage = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => { 
      setIsLoading(true);

      const tokenDariSS = sessionStorage.getItem("token");
      setToken(tokenDariSS);
        
      if (tokenDariSS) {
        try {
          const res = await getRole();

          if (res.user_type) {
            if(res.user_type === "pegawai"){
              const jabatanData = await getJabatan();
              const jabatan = jabatanData.jabatan;
              
              navigate(`/${res.user_type}/${jabatan}`);
            }else {
              navigate(`/${res.user_type}`);
            }
            
          }
        } catch (err) {
          console.log(err);
          sessionStorage.removeItem("token");
          navigate("/");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [navigate]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return !token && (
    
    <Container className="mt-5">
    <div className="text-center mb-3 d-flex flex-row justify-content-center align-items-center gap-3">
      <img src={reusemart} alt="ReuseMart" />
      <h1 className="mt-1 pb-1 hijau" >L O G I N </h1>
    </div>

      <FormLogin />
    </Container>
  )
    
  
};

export default LoginPage;
