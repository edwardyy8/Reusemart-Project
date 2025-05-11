import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { CreateDonasiOwner, GetAllBarangTerdonasikan, GetRequestNotNull } from "../../../api/apiDonasi";

const TambahDonasiOwner = () => {
  const idPegawai = sessionStorage.getItem("id_pegawai");
  const [barangsTersedia, setBarangsTersedia] = useState([]);
  const [requestDonasis, setRequestDonasis] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    id_barang: "",
    id_request: "",
    nama_penerima: "",
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const tersediaData = await GetAllBarangTerdonasikan();
        if (Array.isArray(tersediaData)) setBarangsTersedia(tersediaData);
        const requestData = await GetRequestNotNull();
        setRequestDonasis(requestData);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "id_request") {
      const selected = requestDonasis.find((r) => r.id_request.toString() === value);
      setSelectedRequest(selected || null);
      setForm((prev) => ({
        ...prev,
        id_request: value,
        nama_penerima: selected?.organisasi?.nama || "",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const idPegawai = sessionStorage.getItem("id_pegawai");

    const finalForm = {
      ...form,
      id_pegawai: idPegawai,
    };

    const res = await CreateDonasiOwner(finalForm);
    setMessage({ type: "success", text: res.message });

    // Redirect ke halaman Kelola Donasi
    navigate("/pegawai/Owner/kelolaDonasi");
    toast.success("Donasi berhasil ditambahkan!");
  } catch (err) {
    setMessage({ type: "error", text: err.message || "Terjadi kesalahan" });
  }
};



  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fcfbf9", padding: "40px" }}>
      <h2 className="text-center mb-4" style={{ color: "green", letterSpacing: "3px" }}>TAMBAH DONASI</h2>

      <div className="mx-auto p-4 rounded" style={{
        backgroundColor: "#f1ece6",
        maxWidth: "500px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        border: "1px solid #ccc"
      }}>
        <form onSubmit={handleSubmit}>
          {/* Dropdown Request */}
          <div className="form-group mb-3">
            <label htmlFor="id_request"><strong>ID Request Donasi</strong></label>
            <select
              name="id_request"
              value={form.id_request}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">-- Pilih ID Request --</option>
              {requestDonasis.map((r) => (
                <option key={r.id_request} value={r.id_request}>
                  {r.id_request}
                </option>
              ))}
            </select>
          </div>

{/* Detail Request */}
<div className="border-top border-bottom py-3 mb-3">
  <p><strong>Detail Request</strong></p>
  <p>Nama Organisasi : {selectedRequest?.organisasi?.nama || "-"}</p>
  <p>Tanggal Request : {selectedRequest?.tanggal_request || "-"}</p>
  <p>Isi Request : {selectedRequest?.isi_request || "-"}</p>
</div>


          {/* Dropdown Barang */}
          <div className="form-group mb-4">
            <label htmlFor="id_barang"><strong>Barang yang akan didonasikan</strong></label>
            <select
              name="id_barang"
              value={form.id_barang}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">-- Pilih Barang --</option>
              {barangsTersedia.map((b) => (
                <option key={b.id_barang} value={b.id_barang}>
                  {b.nama_barang}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Simpan */}
          <div className="text-center">
            <button type="submit" className="btn" style={{
              backgroundColor: "green",
              color: "white",
              padding: "10px 30px",
              borderRadius: "999px"
            }}>
              Simpan
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-3 text-center ${message.type === "success" ? "text-success" : "text-danger"}`}>
            {message.text}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="success" />
          <p className="mt-2">Loading data...</p>
        </div>
      )}
    </div>
  );
};

export default TambahDonasiOwner;
