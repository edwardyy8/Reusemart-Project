import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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

  function ProfileDropdown({ active }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
  
      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [open]);
  
    const handleToggle = (e) => {
      e.stopPropagation();
      setOpen(!open);
    };
  
    return (
      <div ref={dropdownRef} style={{ position: "relative" }}>
        <div onClick={handleToggle} style={{ cursor: "pointer" }}>
          {active ? (
            <BsPersonFill size={25} color="rgba(4, 121, 2, 1)" />
          ) : (
            <BsPerson size={25} color="rgba(4, 121, 2, 1)" />
          )}
        </div>
  
        {open && (
          <div style={{
            position: "absolute",
            top: "30px",
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "5px 0",
            minWidth: "120px",
            zIndex: 100,
          }}>
            <div style={{ padding: "8px", cursor: "pointer" }}
              onClick={() => {
                navigate("/penitip/profile");
                setOpen(false);
                }}>
              Profil Saya
            </div>
            <div style={{ padding: "8px", cursor: "pointer" }} onClick={() => console.log('Logout')}>
              Logout
            </div>
          </div>
        )}
      </div>
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
          name: (
            <ProfileDropdown active={location.pathname === "/penitip/profile"} />
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
