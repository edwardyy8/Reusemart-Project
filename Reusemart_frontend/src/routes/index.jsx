import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NoPage from "../pages/Alluser/NoPage";
import UnauthorizedPage from "../pages/Alluser/UnauthorizedPage";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/Alluser/HomePage";
import DonationPage from "../pages/Alluser/DonationPage";
import CategoriesPage from "../pages/Alluser/CategoriesPage";
import KategoriUtamaPage from "../pages/Alluser/KategoriUtamaPage";
import SearchResultPage from "../pages/Alluser/SearchResultsPage";

import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import LupaPassPage from "../pages/auth/LupaPassPage";
import ResetPassPage from "../pages/auth/ResetPassPage";


import PenitipPage from "../pages/penitip/PenitipPage";
import ProfilePenitipPage from "../pages/penitip/ProfilePenitipPage";
import DetailBarangPage from "../pages/Alluser/DetailBarangPage";


import ManagePenitipPage from "../pages/CS/ManagePenitipPage";
import ClaimMerchandisePage from "../pages/CS/ClaimMerchandisePage";
import VerifikasiPage from "../pages/CS/VerifikasiPage";
import TambahPenitipPage from "../pages/CS/TambahPenitipPage";
import EditPenitipPage from "../pages/CS/EditPenitipPage";

import KelolaOrganisasiPage from "../pages/AllPegawai/Admin/KelolaOrganisasiPage";


import ProtectedRoutes from "./ProtectedRoutes";
import ProtectedFromPegawai from "./ProtectedFromPegawai";
import OrganisasiPage from "../pages/Organisasi/OrganisasiPage";
import CreateRequestPage from "../pages/Organisasi/CreateRequestPage";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NoPage />,
  },
  {
    path: "/tidaksah",
    element: <UnauthorizedPage />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedFromPegawai>
            <Outlet />
          </ProtectedFromPegawai>
        ),
        children: [
          {
            path: "/",
            element: <HomePage />,
          },
          {
            path: "/lupaPassword",
            element: <LupaPassPage />,
          },
          {
            path: "/password-reset/:token",
            element: <ResetPassPage />,
          },
          {
            path: "/register",
            element: <RegisterPage />,
          },
          {
            path: "/donasi",
            element: <DonationPage />,
          },
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/kategori",
            element: <CategoriesPage />,
          },
          {
            path: "/kategori/:id/:subkategoriName",
            element: <KategoriUtamaPage />,
          },
          {
            path: "/search",
            element: <SearchResultPage />,
          },
          {
            path: "/barang/:id",
            element: <DetailBarangPage />,
          }
        ],
      },

      {
        path: "/penitip",
        element: (
          <ProtectedRoutes allowedRoles={['penitip']}>
            <Outlet />
          </ProtectedRoutes>
        ),
        children: [
          {
            path: "",
            element: <PenitipPage />,
          },
          {
            path: "profile",
            element: <ProfilePenitipPage />,
          }
          
        ],
      },

      {
        path:  "/pegawai/Customer Service",
        element: (
          <ProtectedRoutes allowedRoles={['pegawai']} allowedJabatan={['Customer Service']}>
          <Outlet />
          </ProtectedRoutes>
        ),
        children: [
          {
            path: "",
            element: <ManagePenitipPage />,
          },
          {
            path: "verifikasi",
            element: <VerifikasiPage />,
          },
          {
            path: "managePenitip",
            element: <ManagePenitipPage />,
          },
          {
            path: "claimMerchandise",
            element: <ClaimMerchandisePage />,
          },
          {
            path: "managePenitip/tambahPenitip",
            element: <TambahPenitipPage />,
          },
          {
            path: "managePenitip/editPenitip/:id",
            element: <EditPenitipPage />,
          },
        ],
      },


      {
        path: "/pegawai/Admin",
        element: (
          <ProtectedRoutes allowedRoles={['pegawai']} allowedJabatan={['Admin']}>
          <Outlet />
          </ProtectedRoutes>
        ),
        children: [
          {
            path: "",
            element: <KelolaOrganisasiPage />,
          },
          {
            path: "kelolaOrganisasi",
            element: <KelolaOrganisasiPage />,
          }
        ],
      },
      {
        path: "/organisasi",
        element: (
          <ProtectedRoutes allowedRoles={['organisasi']}>
            <Outlet />
          </ProtectedRoutes>
        ),
        children: [
          {
            path: "",
            element: <OrganisasiPage />,
          },
          {
            path: "organisasiPage",
            element: <OrganisasiPage />,
          },
          {
            path: "organisasiPage/tambahRequest",
            element: <CreateRequestPage />,
          }
          
        ],
      },
                                   
    ],
  },
  
]);

const AppRouter = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
