import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { BsPerson, BsPersonFill, BsCart } from 'react-icons/bs';

import TopNavbar from "../components/TopNavbar"; 
import { getRole, getJabatan } from "../api/apiAuth";

import { Container, Spinner } from "react-bootstrap";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [token,  setToken] = useState("");
  const [userType, setUserType] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 

  useEffect(() => {
    const fetchRole = async () => { 
      setIsLoading(true);

      const tokenDariSS = sessionStorage.getItem("token");
      setToken(tokenDariSS);

      try {
        const res = await getRole();

        setUserType(res.user_type);

        if(res.user_type === "pegawai"){
          const jabatanData = await getJabatan();

          setJabatan(jabatanData.jabatan);
        }
      } catch (err) { 
        console.log(err);
        
      }finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, []);

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

  
  //mengatur route yang akan ditampilkan di navbar 
  const getRoutes = () => {
    if (userType === "penitip") {
      return [
        { path: "/", name: "BERANDA" },
        { path: "/donasi", name: "DONASI" },
        { path: "/kategori", name: "KATEGORI" },
        { path: "/register", name: "BUAT AKUN" },
        {
          path: "/penitip/profile",
          name: location.pathname === "/penitip/profile" ? (
            <BsPersonFill
              size={25}
              color="rgba(4, 121, 2, 1)"
            />
            
          ) : (
            <BsPerson
              size={25}
              color="rgba(4, 121, 2, 1)"
            />
          )
        }
      ];
    } 
    // else if (userType === "pegawai") {
    //   if (jabatan === "admin") {
    //     return [
          
    //     ];
    //   } else if (jabatan === "gudang") {
    //     return [
          
    //     ];
    //   } else if (jabatan === "owner") {
    //     return [
          
    //     ];
    //   } else if (jabatan === "cs") {
    //     return [
          
    //     ];
    //   }
    // }
    // else if (userType === "pembeli") {
    //   return [

    //   ];
    // } else if (userType === "organisasi") {

    //   return [

    //   ];
    // }
    else {
      return [
        { path: "/", name: "BERANDA" },
        { path: "/donasi", name: "DONASI" },
        { path: "/kategori", name: "KATEGORI" },
        { path: "/register", name: "BUAT AKUN" },
        {
          path: "/login",
          name: 
            <BsCart
              size={25}
              fill="rgba(4, 121, 2, 1)"
            />
        },
        {
          path: "/login",
          name: location.pathname === "/login" ? (
            <BsPersonFill
              size={25}
              color="rgba(4, 121, 2, 1)"
            />
          ) : (
            <BsPerson
              size={25}
              color="rgba(4, 121, 2, 1)"
            />
          )
        }
      ];
    }
  };

  const routes = getRoutes();

  return (
    <div className="mt-4 pt-5">
      <TopNavbar routes={routes} />
      {children ? children : <Outlet />}
    </div>
  );
};

export default MainLayout;
