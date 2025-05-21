import React, { useState, useEffect } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TambahPenitipanBarang, GetAllRequiredTambahBarang } from "../../../api/apiBarang";

const TambahPenitipanBarangPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id_penitip: "",
    id_kategori: "",
    nama_barang: "",
    stok_barang: 1,
    harga_barang: 0,
    deskripsi: "",
    berat_barang: 0,
    foto_barang: null,
    id_qc: "",
    id_hunter: "",
    tanggal_garansi: ""
  });

  const [dropdownData, setDropdownData] = useState({
    pegawai: [],
    kategori: [],
    penitip: [],
    qc: [],
    hunter: []
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDropdowns = async () => {
      const data = await GetAllRequiredTambahBarang();
      const qcFiltered = data.pegawai.filter((p) => p.id_jabatan === 6);
      const hunterFiltered = data.pegawai.filter((p) => p.id_jabatan === 4);
      setDropdownData({
        pegawai: data.pegawai,
        kategori: data.kategori,
        penitip: data.penitip,
        qc: qcFiltered,
        hunter: hunterFiltered
      });
    };

    fetchDropdowns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      foto_barang: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== null) {
        payload.append(key, val);
      }
    });

    try {
      await TambahPenitipanBarang(payload);
      toast.success("Barang berhasil ditambahkan!");
      navigate("/barang"); // Ganti sesuai route kamu
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan barang.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Container className="mt-5 mb-5">
      <div className="text-center mb-3 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mt-1 pb-1 hijau">TAMBAH</h1>
        <h1 className="mt-1 pb-1 hijau">PENITIPAN BARANG</h1>
      </div>

      <Container className="py-4 px-5 rounded-3 w-50" style={{ border: '1px solid #535353', backgroundColor: '#f1ede9' }}>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Penitip</Form.Label>
            <Form.Select name="id_penitip" value={formData.id_penitip} onChange={handleChange} required>
              <option value="">Pilih Penitip</option>
              {dropdownData.penitip.map((p) => (
                <option key={p.id_penitip} value={p.id_penitip}>{p.nama}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Kategori</Form.Label>
            <Form.Select name="id_kategori" value={formData.id_kategori} onChange={handleChange} required>
              <option value="">Pilih Kategori</option>
              {dropdownData.kategori.map((k) => (
                <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nama Barang</Form.Label>
            <Form.Control type="text" name="nama_barang" value={formData.nama_barang} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stok Barang</Form.Label>
            <Form.Control type="number" name="stok_barang" min="1" value={formData.stok_barang} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Harga Barang</Form.Label>
            <Form.Control type="number" name="harga_barang" value={formData.harga_barang} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control as="textarea" name="deskripsi" value={formData.deskripsi} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Berat Barang (kg)</Form.Label>
            <Form.Control type="number" name="berat_barang" value={formData.berat_barang} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Foto Barang</Form.Label>
            <Form.Control type="file" name="foto_barang" onChange={handleFileChange} accept="image/*" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tanggal Garansi</Form.Label>
            <Form.Control type="date" name="tanggal_garansi" value={formData.tanggal_garansi} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>QC</Form.Label>
            <Form.Select name="id_qc" value={formData.id_qc} onChange={handleChange} required>
              <option value="">Pilih QC</option>
              {dropdownData.qc.map((qc) => (
                <option key={qc.id_pegawai} value={qc.id_pegawai}>{qc.nama}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Hunter (Optional)</Form.Label>
            <Form.Select name="id_hunter" value={formData.id_hunter} onChange={handleChange}>
              <option value="">Pilih Hunter</option>
              {dropdownData.hunter.map((h) => (
                <option key={h.id_pegawai} value={h.id_pegawai}>{h.nama}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="text-center">
            <Button variant="success" type="submit">Tambah Barang</Button>
          </div>
        </Form>
      </Container>
    </Container>
  );
};

export default TambahPenitipanBarangPage;
