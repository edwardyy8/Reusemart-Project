import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import MainLayout from "../layouts/MainLayout";
import PembeliLayout from "../layouts/PembeliLayout";

import HomePage from "../pages/Alluser/HomePage";
import DonationPage from "../pages/Alluser/DonationPage";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import LupaPassPage from "../pages/auth/LupaPassPage";
import LupaPass2Page from "../pages/auth/LupaPass2Page";

import ProtectedRoutes from "./ProtectedRoutes";

const router = createBrowserRouter([
  {
    path: "*",
    element: <div>Routes Not Found!</div>,
  },
  {
    path: "/",
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
      // {
      //   path: "/categories",
      //   element: <CategoriesPage />,
      // },
    ],
  },
  // {
  //   path: "/Pembeli",
  //   element: (
  //     <ProtectedRoutes>
  //       <PembeliLayout />
  //     </ProtectedRoutes>
  //   ),
  //   children: [
  //     {
  //       path: "/Pembeli",
  //       element: <DashboardPage />,
  //     },
  //     {
  //       path: "/Pembeli/content",
  //       element: <ContentPage />,
  //     },
  //   ],
  // },
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
