import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import MainLayout from "../layouts/MainLayout";
import PenitipLayout from "../layouts/PenitipLayout";

import HomePage from "../pages/Alluser/HomePage";
import DonationPage from "../pages/Alluser/DonationPage";
import CategoriesPage from "../pages/Alluser/CategoriesPage";
import KategoriUtamaPage from "../pages/Alluser/KategoriUtamaPage";

import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import LupaPassPage from "../pages/auth/LupaPassPage";
import LupaPass2Page from "../pages/auth/LupaPass2Page";


import PenitipPage from "../pages/penitip/PenitipPage";
import ProfilePenitipPage from "../pages/penitip/ProfilePenitipPage";
import DetailBarangPage from "../pages/Alluser/DetailBarangPage";


import ProtectedRoutes from "./ProtectedRoutes";
import UnauthorizedPage from "../pages/Alluser/UnauthorizedPage";

const router = createBrowserRouter([
  {
    path: "*",
    element: <div>Routes Not Found!</div>,
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
        element: <HomePage />,
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
        path: "/lupaPassword",
        element: <LupaPassPage />,
      },
      {
        path: "/lupaPassword2",
        element: <LupaPass2Page />,
      },
      {
        path: "/kategori",
        element: <CategoriesPage />,
      },
      {
        path: "/kategori/:id",
        element: <KategoriUtamaPage />,
      },
      {
        path: "/barang/:id",
        element: <DetailBarangPage />,
      },

                                   
    ],
  },
  {
    path: "/penitip",
    element: (
      <ProtectedRoutes allowedRoles={['penitip']}>
        <PenitipLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/penitip",
        element: <PenitipPage />,
      },
      {
        path: "/penitip/profile",
        element: <ProfilePenitipPage />,
      }
      
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
