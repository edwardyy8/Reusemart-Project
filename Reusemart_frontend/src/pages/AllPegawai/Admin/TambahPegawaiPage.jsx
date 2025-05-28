import React, { useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { tambahPegawai } from "../../../api/apiPegawai";

const TambahPegawaiPage = () => {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPegawaiData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPegawaiData((prevData) => ({
      ...prevData,
      foto_profile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("nama", pegawaiData.nama_pegawai);
    formData.append("email", pegawaiData.email);
    formData.append("password", pegawaiData.password);
    formData.append("tanggal_lahir", pegawaiData.tanggal_lahir);
    formData.append("confirm_password", pegawaiData.confirm_password);
    formData.append("id_jabatan", pegawaiData.id_jabatan);
    if (pegawaiData.foto_profile) {
      formData.append("foto_pegawai", pegawaiData.foto_profile);
    }

    try {
      await tambahPegawai(formData);
      toast.success("Pegawai berhasil ditambah");
      navigate("/pegawai/Admin/kelolaPegawai");
    } catch (err) {
      console.error("Error response:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <Container className="mt-5 mb-5">
      <div className="text-center mb-3 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mt-1 pb-1 hijau">T A M B A H</h1>
        <h1 className="mt-1 pb-1 hijau">P E G A W A I</h1>
      </div>

      <Container className="mt-4 mb-5 py-4 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
        <Form onSubmit={handleSubmit} encType="multipart/form-data" style={{ maxWidth: "550px", margin: "auto" }}>
          <Form.Group className="mb-3">
            <Form.Label>Nama Pegawai</Form.Label>
            <Form.Control
              className="text-muted"
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
              className="text-muted"
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
              className="text-muted"
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
              className="text-muted"
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
              className="text-muted"
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
              className="text-muted"
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
            <Form.Label>Foto Profil (upload baru jika ingin mengubah)</Form.Label>
            <Form.Control
              type="file"
              name="foto_profile"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          <div className="d-flex gap-3">
            <Button 
              type="submit" 
              disabled={loading} 
              className="mt-3 w-100 border-0 buttonSubmit btn-lg rounded-5 shadow-sm" 
              style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Simpan"}
            </Button>
            <Button 
              variant="secondary" 
              className="mt-3 w-100 border-0 btn-lg rounded-5 shadow-sm" 
              onClick={() => navigate(-1)}
            >
              Kembali
            </Button>
          </div>
        </Form>
      </Container>
    </Container>
  );
};

export default TambahPegawaiPage;