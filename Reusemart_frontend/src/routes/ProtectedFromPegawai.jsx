import { useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRole, getJabatan } from "../api/apiAuth";
import { Spinner, Container } from "react-bootstrap";

/* eslint-disable react/prop-types */
const ProtectedFromPegawai = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 

  useEffect(() => {
    const fetchRole = async () => { 
      setIsLoading(true);

      const tokenDariSS = sessionStorage.getItem("token");
      setToken(tokenDariSS);

      if (!tokenDariSS) {
        setIsLoading(false);
        return;
      }else{
        try {
            const res = await getRole();

            setUserType(res.user_type);

            if(res.user_type === "pegawai"){
              const jabatanData = await getJabatan();
    
              if (jabatanData.jabatan) {
                navigate(`/${res.user_type}/${jabatanData.jabatan}`);
                return;
              }
            }

        } catch (err) { 
            console.log(err);
            navigate("/tidaksah"); 
        }finally {
            setIsLoading(false);
        }
      }
      
    };

    fetchRole();
  }, [navigate]);

  if (isLoading) { 
    return(
      <Container style={{  
        minHeight: "100vh", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
        }}>
          <div className="text-center">
            <Spinner
                as="span"
                animation="border"
                variant="success"
                size="lg"
                role="status"
                aria-hidden="true"
            />
            <p className="mb-0">Loading...</p>
          </div>
      </Container>
    ); 
  }

  return children ? children : <Outlet />;
};

export default ProtectedFromPegawai;
