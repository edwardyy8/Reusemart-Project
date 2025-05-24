import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { BsPerson, BsPersonFill, BsCart, BsCartFill } from 'react-icons/bs';

import TopNavbar from "../components/TopNavbar"; 
import SideBarPegawai from "../components/SideBarPegawai"; 
import { getRole, getJabatan } from "../api/apiAuth";

import { Container, Spinner, Button, Badge } from "react-bootstrap";

import { LogOut } from "../api/apiAuth";
import { getFotoPegawai } from "../api/apiPegawai";

import ModalLogout from "../components/modals/ModalLogout";
import ModalLogoutUser from "../components/modals/ModalLogoutUser";

import { useKeranjang } from "../context/KeranjangContext";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [token,  setToken] = useState("");
  const [userType, setUserType] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [idPegawai, setIdPegawai] = useState("");
  const [namaPegawai, setNamaPegawai] = useState("");
  const [fotoPegawai, setFotoPegawai] = useState("");
  const [pathFotoPegawai, setPathFotoPegawai] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
 
  const { itemKeranjang } = useKeranjang();

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
          setIdPegawai(jabatanData.id_pegawai);

          const fotoPegawaiLaravel = await getFotoPegawai(jabatanData.foto_profile);
          
          const fileFoto =  URL.createObjectURL(fotoPegawaiLaravel);
          setPathFotoPegawai(fileFoto);

          sessionStorage.setItem("id_pegawai", jabatanData.id_pegawai);
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

  function ProfileDropdown({ active }) {
    const [open, setOpen] = useState(false);
    const [showModalLogout, setShowModalLogout] = useState(false);
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
      e.preventDefault();
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
              onClick={(e) => {
                e.preventDefault();     
                e.stopPropagation();
                navigate("/penitip/profile");
                setOpen(false);
              }}>
              Profil Saya
            </div>
            <div style={{ padding: "8px", cursor: "pointer" }} 
                 onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowModalLogout(true);
                  setOpen(false);
                }}>
              Keluar
            </div>
            
          </div>
        )}
        {showModalLogout && <ModalLogoutUser show={showModalLogout} onClose={() => setShowModalLogout(false)} />}
      </div>
    );
  }

  function ProfilePembeliDropdown({ active }) {
    const [open, setOpen] = useState(false);
    const [showModalLogout, setShowModalLogout] = useState(false);
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
      e.preventDefault();
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
                navigate("/pembeli/profile");
                setOpen(false);
                }}>
              Profil Saya
            </div>
            <div style={{ padding: "8px", cursor: "pointer" }} 
                 onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowModalLogout(true);
                  setOpen(false);
                }}>
              Keluar
            </div>
          </div>
        )}
        {showModalLogout && <ModalLogoutUser show={showModalLogout} onClose={() => setShowModalLogout(false)} />}
      </div>
    );
  }

  function ProfileDropdownOrganisasi({ active }) {
    const [open, setOpen] = useState(false);
    const [showModalLogout, setShowModalLogout] = useState(false);
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
      e.preventDefault();
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
              onClick={(e) => {
                e.preventDefault();     
                e.stopPropagation();
                navigate("/organisasi/profile");
                setOpen(false);
              }}>
              Profil Saya
            </div>
            <div style={{ padding: "8px", cursor: "pointer" }} 
                 onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowModalLogout(true);
                  setOpen(false);
                }}>
              Keluar
            </div>
            
          </div>
        )}
        {showModalLogout && <ModalLogoutUser show={showModalLogout} onClose={() => setShowModalLogout(false)} />}
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
    else if (userType === "pegawai") {
      if (jabatan === "Admin") {
        return [
          { path: "/pegawai/Admin/kelolaJabatan", name: "Kelola Jabatan" },
          { path: "/pegawai/Admin/kelolaPegawai", name: "Kelola Pegawai" },
          { path: "/pegawai/Admin/kelolaOrganisasi", name: "Kelola Organisasi" },
          { path: "/pegawai/Admin/kelolaMerchandise", name: "Kelola Merchandise" },
        ];
      }
   
      else if (jabatan === "Owner") {
        return [
          { path: "/pegawai/Owner/kelolaRequestDonasi", name: "Kelola Request Donasi" },
          { path: "/pegawai/Owner/historyDonasi", name: "History Donasi" },
          { path: "/pegawai/Owner/kelolaDonasi", name: "Kelola Donasi" },
          { path: "/pegawai/Owner/cetakLaporan", name: "Cetak Laporan" },
        ];
      } 

      else if (jabatan === "Customer Service") {
        return [
          { path: "/pegawai/Customer%20Service/verifikasi", name: "Verifikasi Bukti Bayar" },
          { path: "/pegawai/Customer%20Service/managePenitip", name: "Kelola Penitip" },
          { path: "/pegawai/Customer%20Service/claimMerchandise", name: "Kelola Klaim Merchandise" },
          { path: "/pegawai/Customer%20Service/balasDiskusi", name: "Balas Diskusi" },
        ];
      }

      else if (jabatan === "Gudang") {
        return [
          { path: "/pegawai/Gudang/kelolaBarang", name: "Kelola Barang" },
          { path: "/pegawai/Gudang/catatPengambilan", name: "Catat Pengambilan Barang" },
          { path: "/pegawai/Gudang/seluruhPemesanan", name: "Seluruh Pemesanan" },
          { path: "/pegawai/Gudang/kelolaPickup", name: "Kelola Pickup" },
          { path: "/pegawai/Gudang/kelolaPengiriman", name: "Kelola Pengiriman" },
          { path: "/pegawai/Gudang/cetakNota", name: "Cetak Nota" },
        ];
      }
    }
    else if (userType === "pembeli") {
      return [
        { path: "/", name: "BERANDA" },
        { path: "/donasi", name: "DONASI" },
        { path: "/kategori", name: "KATEGORI" },
        { path: "/register", name: "BUAT AKUN" },
        {
          path: "/pembeli/keranjang",
          name: (
            <div style={{ position: "relative" }}>
              { location.pathname === "/pembeli/keranjang" ? (
                  <BsCartFill size={25} color="rgba(4, 121, 2, 1)" />
                ) : (
                  <BsCart size={25} color="rgba(4, 121, 2, 1)" />
                )
              }
              {itemKeranjang.length > 0 && (
                <Badge
                  pill
                  bg="danger"
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -10,
                    fontSize: "0.7rem",
                  }}
                >
                  {itemKeranjang.length}
                </Badge>
              )}
            </div>
          )
        },
        {
          path: "/pembeli/profile",
          name: (
            <ProfilePembeliDropdown active={location.pathname === "/pembeli/profile"} />
          )
        }
      ];
    } 
    else if (userType === "organisasi") {
      return [
        { path: "/", name: "BERANDA" },
        { path: "/donasi", name: "DONASI" },
        { path: "/kategori", name: "KATEGORI" },
        { path: "/register", name: "BUAT AKUN" },
        {
          path: "/organisasi/profile",
          name: (
            <ProfileDropdownOrganisasi active={location.pathname === "/organisasi/profile"} />
          )
        }
      ];
    }
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
          <div className="pt-5">
            {children ? children : <Outlet />} 
          </div>
        </>
      )}
      
    </div>
  );
};

export default MainLayout;
