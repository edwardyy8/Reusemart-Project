import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { BsPerson, BsPersonFill, BsCart } from 'react-icons/bs';

import TopNavbar from "../components/TopNavbar"; 
import SideBarPegawai from "../components/SideBarPegawai"; 
import { getRole, getJabatan } from "../api/apiAuth";

import { Container, Spinner, Button } from "react-bootstrap";

import { LogOut } from "../api/apiAuth";
import { getFotoPegawai } from "../api/apiPegawai";

import ModalLogout from "../components/modals/ModalLogout";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [token,  setToken] = useState("");
  const [userType, setUserType] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [namaPegawai, setNamaPegawai] = useState("");
  const [fotoPegawai, setFotoPegawai] = useState("");
  const [pathFotoPegawai, setPathFotoPegawai] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
 

  useEffect(() => {
    const fetchRoleDanFoto = async () => { 
      setIsLoading(true);

      const tokenDariSS = sessionStorage.getItem("token");
      setToken(tokenDariSS);

      try {
        const res = await getRole();

        setUserType(res.user_type);

        if(res.user_type === "pegawai"){
          const jabatanData = await getJabatan();

          setJabatan(jabatanData.jabatan);
          setNamaPegawai(jabatanData.nama_pegawai);
          setFotoPegawai(jabatanData.foto_profile);

          const fotoPegawaiLaravel = await getFotoPegawai(jabatanData.foto_profile);
          
          const fileFoto =  URL.createObjectURL(fotoPegawaiLaravel);
          setPathFotoPegawai(fileFoto);
        }
      } catch (err) { 
        console.log(err);
        
      }finally {
        setIsLoading(false);
      }
    };

    fetchRoleDanFoto();

    return () => {
      if (pathFotoPegawai) {
        URL.revokeObjectURL(pathFotoPegawai);
      }
    };
  }, [token]);

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
    else if (userType === "pegawai") {
      if (jabatan === "Admin") {
        return [
          { path: "/pegawai/admin/kelolaJabatan", name: "Kelola Jabatan" },
          { path: "/pegawai/admin/kelolaPegawai", name: "Kelola Pegawai" },
          { path: "/pegawai/admin/kelolaOrganisasi", name: "Kelola Organisasi" },
          { path: "/pegawai/admin/kelolaMerchandise", name: "Kelola Merchandise" },
        ];
      }
    //  else if (jabatan === "Gudang") {
    //     return [
          
    //     ];
    //   } else if (jabatan === "Owner") {
    //     return [
          
    //     ];
    //   } else if (jabatan === "Customer Service") {
    //     return [
          
    //     ];
    //   }
    }
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
    <div className="pt-4">
      {userType === "pegawai" ? (
        <>
          <SideBarPegawai routes={routes} />
          <div style={{ marginLeft: "250px" }}>
            <Container fluid className="ps-4 d-flex mb-3 ">
              <h2>Selamat Datang {jabatan} {namaPegawai} </h2>
              <ModalLogout />
              <img src={pathFotoPegawai} height="50" alt="Profile Pegawai" className="rounded-5 me-2" />
            </Container>
            <Container fluid className="borderHijauBwh mb-2" ></Container>
            {children ? children : <Outlet />}  
          </div>
        </>
      ) : (
        <>
          <TopNavbar routes={routes} />
          {children ? children : <Outlet />} 
        </>
      )}
      
    </div>
  );
};

export default MainLayout;
