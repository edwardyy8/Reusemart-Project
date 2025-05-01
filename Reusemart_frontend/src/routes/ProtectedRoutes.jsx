import { useNavigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRole, getJabatan } from "../api/apiAuth";
import { Spinner, Container } from "react-bootstrap";

/* eslint-disable react/prop-types */
const ProtectedRoutes = ({ allowedRoles, children, allowedJabatan }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [userType, setUserType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [jabatan, setJabatan] = useState("");
 

  useEffect(() => {
    const fetchRole = async () => { 
      setIsLoading(true);

      const tokenDariSS = sessionStorage.getItem("token");
      setToken(tokenDariSS);

      if (!tokenDariSS) {
        navigate("/");
      }

      try {
        const res = await getRole();

        setUserType(res.user_type);

        if(res.user_type === "pegawai"){
          const jabatanData = await getJabatan();

          setJabatan(jabatanData.jabatan);

          if (allowedJabatan && !allowedJabatan.includes(jabatanData.jabatan)) {
            navigate("/tidaksah");
            return;
          }

          if (res.user_type && (allowedJabatan && allowedJabatan.includes(jabatanData.jabatan))) {
            navigate(`/${res.user_type}/${jabatanData.jabatan}`);
            return;
          }
        }

        if (allowedRoles && !allowedRoles.includes(res.user_type)) {
          navigate("/tidaksah");
          return;
        }

        if (res.user_type && (allowedRoles && allowedRoles.includes(res.user_type))) {
          navigate(`/${res.user_type}/profile`);
        }

      } catch (err) { 
        console.log(err);
        sessionStorage.removeItem("token");
        navigate("/"); 
      }finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [navigate, allowedRoles, allowedJabatan]);

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

  return token && (children ? children : <Outlet />);
};

export default ProtectedRoutes;
