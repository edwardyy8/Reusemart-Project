import React, { useState } from "react";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const TambahPegawaiPage = () => {
  const navigate = useNavigate();

  // State untuk menyimpan data pegawai
  const [pegawaiData, setPegawaiData] = useState({
    nama_pegawai: "",
    email: "",
    password: "",
    confirm_password: "",
    tanggal_lahir: "",
    id_jabatan: "",
    foto_profile: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle perubahan input pada form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPegawaiData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle perubahan input untuk file foto
  const handleFileChange = (e) => {
    setPegawaiData((prevData) => ({
      ...prevData,
      foto_profile: e.target.files[0],
    }));
  };

  // Kirim data pegawai ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const formData = new FormData();
    formData.append("nama", pegawaiData.nama_pegawai);
    formData.append("email", pegawaiData.email);
    formData.append("password", pegawaiData.password);
    formData.append("tanggal_lahir", pegawaiData.tanggal_lahir);  // Menambahkan tanggal lahir
    formData.append("confirm_password", pegawaiData.confirm_password);
    formData.append("id_jabatan", pegawaiData.id_jabatan);  // Periksa apakah id_jabatan ada di FormData
    if (pegawaiData.foto_profile) {
      formData.append("foto_pegawai", pegawaiData.foto_profile);
    }
  
    const token = sessionStorage.getItem("token");  // Mengambil token otentikasi
  
    try {
      const response = await axios.post("http://localhost:8000/api/tambahPegawai", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response:", response.data);
      console.log('ID Jabatan yang dikirim:', pegawaiData.id_jabatan);

      if (response.status === 201) {
        toast.success("Pegawai berhasil ditambah");
        navigate("/pegawai/Admin/kelolaPegawai");
      } else {
        throw new Error("Gagal menambah pegawai");
      }
    } catch (err) {
      console.error("Error response:", err.response?.data); // Menampilkan detail error
      setError(err.response?.data?.message || "Terjadi kesalahan");
      toast.error(err.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <div className="text-center mb-3 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mt-1 pb-1 hijau">T A M B A H</h1>
        <h1 className="mt-1 pb-1 hijau">P E G A W A I</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Container className="mt-4 mb-5 py-4 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
        <Form onSubmit={handleSubmit} encType="multipart/form-data" style={{ maxWidth: "550px", margin: "auto" }}>
          
          <Form.Group className="mb-3">
            <Form.Label>Nama Pegawai</Form.Label>
            <Form.Control
              type="text"
              name="nama_pegawai"
              value={pegawaiData.nama_pegawai}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Pegawai</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={pegawaiData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={pegawaiData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Konfirmasi Password</Form.Label>
            <Form.Control
              type="password"
              name="confirm_password"
              value={pegawaiData.confirm_password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tanggal Lahir</Form.Label>
            <Form.Control
              type="date"
              name="tanggal_lahir"
              value={pegawaiData.tanggal_lahir}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Jabatan</Form.Label>
            <Form.Control
              as="select"
              name="id_jabatan"
              value={pegawaiData.id_jabatan}
              onChange={handleChange}
              required
            >
              <option value="">-- Pilih Jabatan --</option>
              <option value={1}>Owner</option>
              <option value={2}>Admin</option>
              <option value={3}>Customer Service</option>
              <option value={4}>Hunter</option>
              <option value={5}>Gudang</option>
              <option value={6}>QualityControl</option>
              <option value={7}>Kurir</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Foto Profil</Form.Label>
            <Form.Control
              type="file"
              name="foto_profile"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          <Button type="submit" disabled={loading} variant="primary" className="w-100">
            {loading ? <Spinner animation="border" size="sm" /> : "Tambah Pegawai"}
          </Button>
        </Form>
      </Container>
    </Container>
  );
};

export default TambahPegawaiPage;
