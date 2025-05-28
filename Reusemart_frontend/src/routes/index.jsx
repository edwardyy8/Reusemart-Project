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
import DetailBarangPage from "../pages/Alluser/DetailBarangPage";

import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import LupaPassPage from "../pages/auth/LupaPassPage";
import ResetPassPage from "../pages/auth/ResetPassPage";

import ProfilePenitipPage from "../pages/penitip/ProfilePenitipPage";
import DetailPenjualanPage from "../pages/penitip/DetailPenjualanPage";

import KelolaOrganisasiPage from "../pages/AllPegawai/Admin/KelolaOrganisasiPage";
import EditOrganisasiPage from "../pages/AllPegawai/Admin/EditOrganisasiPage";

import KelolaPegawaiPage from "../pages/AllPegawai/Admin/KelolaPegawaiPage";
import EditPegawaiPage from "../pages/AllPegawai/Admin/EditPegawaiPage";
import TambahPegawaiPage from "../pages/AllPegawai/Admin/TambahPegawaiPage";

import KelolaJabatanPage from "../pages/AllPegawai/Admin/KelolaJabatanPage";
import EditJabatanPage from "../pages/AllPegawai/Admin/EditJabatanPage";
import TambahMerchandisePage from "../pages/AllPegawai/Admin/TambahMerchandisePage";

import KelolaMerchandisePage from "../pages/AllPegawai/Admin/KelolaMerchandisePage";
import EditMerchandisePage from "../pages/AllPegawai/Admin/EditMerchandisePage";

import HistoryDonasiPage from "../pages/AllPegawai/Owner/HistoryDonasiPage";
import KelolaRequestDonasiPage from "../pages/AllPegawai/Owner/KelolaRequestDonasiPage";
import KelolaDonasiPage from "../pages/AllPegawai/Owner/KelolaDonasiPage";
import TambahDonasiOwner from "../pages/AllPegawai/Owner/TambahDonasiOwner";

import ManagePenitipPage from "../pages/AllPegawai/CS/ManagePenitipPage";
import ClaimMerchandisePage from "../pages/AllPegawai/CS/ClaimMerchandisePage";
import VerifikasiPage from "../pages/AllPegawai/CS/VerifikasiPage";
import TambahPenitipPage from "../pages/AllPegawai/CS/TambahPenitipPage";
import EditPenitipPage from "../pages/AllPegawai/CS/EditPenitipPage";

import KelolaPengirimanPage from "../pages/AllPegawai/Gudang/KelolaPengirimanPage";
import KelolaPickupPage from "../pages/AllPegawai/Gudang/KelolaPickupPage";
import SeluruhPemesananPage from "../pages/AllPegawai/Gudang/seluruhPemesananPage";
import CetakNotaPage from "../pages/AllPegawai/Gudang/cetakNotaPage";
import CatatPengambilanBarangPage from "../pages/AllPegawai/Gudang/CatatPengambilanBarangPage";
import KelolaPenitipanBarangPage from "../pages/AllPegawai/Gudang/KelolaPenitipanBarangPage";
import EditPenitipanBarangPage from "../pages/AllPegawai/Gudang/EditPenitipanBarangPage";
import TambahPenitipanBarangPage from "../pages/AllPegawai/Gudang/TambahPenitipanBarangPage";

import ProfilePembeliPage from "../pages/pembeli/ProfilePembeliPage";
import EditAlamatPage from "../pages/pembeli/EditAlamatPage";
import TambahAlamatPage from "../pages/pembeli/TambahAlamatPage";
import DetailPembelianPage from "../pages/pembeli/DetailPembelianPage";

import ProtectedRoutes from "./ProtectedRoutes";
import ProtectedFromPegawai from "./ProtectedFromPegawai";

import OrganisasiPage from "../pages/Organisasi/OrganisasiPage";
import CreateRequestPage from "../pages/Organisasi/CreateRequestPage";
import EditRequestPage from "../pages/Organisasi/EditRequestPage";

import KeranjangPage from "../pages/pembeli/KeranjangPage";

import BalasDiskusiPage from "../pages/AllPegawai/CS/BalasDiskusiPage";
import CheckoutPage from "../pages/pembeli/CheckoutPage";
import UbahAlamatPage from "../pages/pembeli/UbahAlamatPage";
import TransferBuktiPage from "../pages/pembeli/TransferBuktiPage";



const router = createBrowserRouter([
  { path: "*", element: <NoPage /> },
  { path: "/tidaksah", element: <UnauthorizedPage /> },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <ProtectedFromPegawai><Outlet /></ProtectedFromPegawai>,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/lupaPassword", element: <LupaPassPage /> },
          { path: "/password-reset/:token", element: <ResetPassPage /> },
          { path: "/register", element: <RegisterPage /> },
          { path: "/login", element: <LoginPage /> },
          { path: "/donasi", element: <DonationPage /> },
          { path: "/kategori", element: <CategoriesPage /> },
          { path: "/kategori/:id/:subkategoriName", element: <KategoriUtamaPage /> },
          { path: "/search", element: <SearchResultPage /> },
          { path: "/barang/:id", element: <DetailBarangPage /> }
        ],
      },
      {
        path: "/penitip",
        element: <ProtectedRoutes allowedRoles={["penitip"]}><Outlet /></ProtectedRoutes>,
        children: [
          { path: "", element: <ProfilePenitipPage /> },
          { path: "profile", element: <ProfilePenitipPage /> },
          { path: "detailPenjualan/:id", element: <DetailPenjualanPage /> },
        ],
      },
      {
        path: "/pegawai/Customer Service",
        element: <ProtectedRoutes allowedRoles={["pegawai"]} allowedJabatan={["Customer Service"]}><Outlet /></ProtectedRoutes>,
        children: [
          { path: "", element: <ManagePenitipPage /> },
          { path: "verifikasi", element: <VerifikasiPage /> },
          { path: "managePenitip", element: <ManagePenitipPage /> },
          { path: "claimMerchandise", element: <ClaimMerchandisePage /> },
          { path: "managePenitip/tambahPenitip", element: <TambahPenitipPage /> },
          { path: "managePenitip/editPenitip/:id", element: <EditPenitipPage /> },
          { path: "balasDiskusi", element: <BalasDiskusiPage /> },
        ],
      },
      {
        path: "/pegawai/Gudang",
        element: <ProtectedRoutes allowedRoles={["pegawai"]} allowedJabatan={["Gudang"]}><Outlet /></ProtectedRoutes>,
        children: [
          { path: "", element: <KelolaPenitipanBarangPage /> },
          { path: "kelolaPenitipanBarang", element: <KelolaPenitipanBarangPage /> },
          { path: "kelolaPenitipanBarang/:id_barang", element: <EditPenitipanBarangPage /> },
          { path: "kelolaPenitipanBarang/tambahPenitipanBarang", element: <TambahPenitipanBarangPage /> },
        ],
      },
      {
        path: "/pegawai/Owner",
        element: <ProtectedRoutes allowedRoles={["pegawai"]} allowedJabatan={["Owner"]}><Outlet /></ProtectedRoutes>,
        children: [
          { path: "", element: <HistoryDonasiPage /> },
          { path: "historyDonasi", element: <HistoryDonasiPage /> },
          { path: "kelolaRequestDonasi", element: <KelolaRequestDonasiPage /> },
          { path: "kelolaDonasi", element: <KelolaDonasiPage /> },
          { path: "kelolaDonasi/tambahDonasiOwner", element: <TambahDonasiOwner /> },
        ],
      },
      {
        path: "/pegawai/Admin",
        element: <ProtectedRoutes allowedRoles={["pegawai"]} allowedJabatan={["Admin"]}><Outlet /></ProtectedRoutes>,
        children: [
          { path: "", element: <KelolaOrganisasiPage /> },
          { path: "kelolaPegawai", element: <KelolaPegawaiPage /> },
          { path: "kelolaPegawai/:id", element: <EditPegawaiPage /> },
          { path: "kelolaPegawai/tambahPegawai", element: <TambahPegawaiPage /> },
          { path: "kelolaJabatan", element: <KelolaJabatanPage /> },
          { path: "kelolaJabatan/:id", element: <EditJabatanPage /> },
          { path: "kelolaOrganisasi", element: <KelolaOrganisasiPage /> },
          { path: "kelolaOrganisasi/:id", element: <EditOrganisasiPage /> },
          { path: "kelolaMerchandise", element: <KelolaMerchandisePage /> },
          { path: "kelolaMerchandise/:id", element: <EditMerchandisePage /> },
          { path: "kelolaMerchandise/tambahMerchandise", element: <TambahMerchandisePage /> },
        ],
      },
      {
        path: "/pegawai/Gudang",
        element: <ProtectedRoutes allowedRoles={["pegawai"]} allowedJabatan={["Gudang"]}><Outlet /></ProtectedRoutes>,
        children: [
          { path: "", element: <SeluruhPemesananPage/> },
          { path: "catatPengambilan", element:<CatatPengambilanBarangPage/> },
          { path: "kelolaPengiriman", element: <KelolaPengirimanPage /> },
          { path: "kelolaPickup", element: <KelolaPickupPage /> },
          { path: "SeluruhPemesanan", element: <SeluruhPemesananPage /> },
          { path: "CetakNota", element: <CetakNotaPage /> },
        ],
      },
      {
        path: "/pembeli",
        element: <ProtectedRoutes allowedRoles={["pembeli"]}><Outlet /></ProtectedRoutes>,
        children: [
          { path: "profile", element: <ProfilePembeliPage /> },
          { path: "editAlamat/:id", element: <EditAlamatPage /> },
          { path: "tambahAlamat", element: <TambahAlamatPage /> },
          { path: "detailPembelian/:id", element: <DetailPembelianPage /> },
          { path: "keranjang", element: <KeranjangPage /> }, 
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
          {
            path: "ubahAlamat",
            element: <UbahAlamatPage />,
          },
          {
            path: "transferBukti/:id",
            element: <TransferBuktiPage />,
          }
        ],
      },
      {
        path: "/organisasi",
        element: <ProtectedRoutes allowedRoles={["organisasi"]}><Outlet /></ProtectedRoutes>,
        children: [
          { path: "", element: <OrganisasiPage /> },
          { path: "profile", element: <OrganisasiPage /> },
          { path: "organisasiPage", element: <OrganisasiPage /> },
          { path: "organisasiPage/tambahRequest", element: <CreateRequestPage /> },
          { path: "organisasiPage/editRequest/:id", element: <EditRequestPage /> },
        ],
      },
    ],
  },
]);

const AppRouter = () => {
  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <RouterProvider router={router} />
    </>
  );
};

export default AppRouter;
