import { Outlet, useLocation } from "react-router-dom";  

import { BsPerson, BsPersonFill } from 'react-icons/bs';

// import component 
import TopNavbar from "../components/TopNavbar";  

const PenitipLayout = ({ children }) => {
  const location = useLocation();

  //mengatur route yang akan ditampilkan di navbar
  const routes = [
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
  
  return (
    <div className="mt-4 pt-5">
      <TopNavbar routes={routes} />
      {children ? children : <Outlet />}
    </div>
  );
};

export default PenitipLayout;
