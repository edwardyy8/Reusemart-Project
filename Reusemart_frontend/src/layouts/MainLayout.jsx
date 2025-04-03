import { Outlet } from "react-router-dom"; 
import { BsPerson } from 'react-icons/bs';
import { BsCart } from 'react-icons/bs';

// import component 
import TopNavbar from "../components/TopNavbar"; 

//mengatur route yang akan ditampilkan di navbar 
const routes = [
  { path: "/", name: "BERANDA" },
  { path: "/donasi", name: "DONASI" },
  { path: "/kategori", name: "KATEGORI" },
  { path: "/register", name: "BUAT AKUN" },
  {
    path: "/login",
    name: location.pathname === "/login" ? (
      <BsCart
        size={25}
        fill="rgba(4, 121, 2, 1)"
      />
    ) : (
      <BsCart
        size={25}
        color="rgba(4, 121, 2, 1)"
        stroke="1"
      />
    )
  },
  {
    path: "/login",
    name: location.pathname === "/login" ? (
      <BsPerson
        size={25}
        fill="rgba(4, 121, 2, 1)"
      />
    ) : (
      <BsPerson
        size={25}
        color="rgba(4, 121, 2, 1)"
        stroke="1"
      />
    )
  }
];

const MainLayout = ({ children }) => {
  return (
    <div className="mt-4 pt-5">
      <TopNavbar routes={routes} />
      {children ? children : <Outlet />}
    </div>
  );
};

export default MainLayout;
