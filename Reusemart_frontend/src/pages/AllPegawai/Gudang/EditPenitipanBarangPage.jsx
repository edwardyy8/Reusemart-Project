import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert, Spinner, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { EditPenitipanBarang, GetPenitipanBarangById, GetAllRequiredTambahBarang } from "../../../api/apiBarang";

const EditPenitipanBarangForm = ({ onSuccess }) => {
  const { id_barang } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_barang: "",
    harga_barang: "",
    deskripsi: "",
    berat_barang: "",
    tanggal_garansi: "",
    id_kategori: "",
    foto_barang: null,
  });
  const [originalData, setOriginalData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [kategoris, setKategoris] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    GetAllRequiredTambahBarang()
      .then((data) => {
        setKategoris(data.kategori || []);
      })
      .catch(() => {
        setError("Gagal mengambil data kategori.");
      });
  }, []);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const data = await GetPenitipanBarangById(id_barang);
        const d = data.data;
        setFormData({
          nama_barang: d.nama_barang || "",
          harga_barang: d.harga_barang ? String(d.harga_barang) : "",
          deskripsi: d.deskripsi || "",
          berat_barang: d.berat_barang ? String(d.berat_barang) : "",
          tanggal_garansi: d.tanggal_garansi || "",
          id_kategori: d.id_kategori ? String(d.id_kategori) : "",
          foto_barang: null,
        });
        setOriginalData({
          nama_barang: d.nama_barang || "",
          harga_barang: d.harga_barang ? String(d.harga_barang) : "",
          deskripsi: d.deskripsi || "",
          berat_barang: d.berat_barang ? String(d.berat_barang) : "",
          tanggal_garansi: d.tanggal_garansi || "",
          id_kategori: d.id_kategori ? String(d.id_kategori) : "",
        });
        if (d.foto_barang) {
          setPreview(`http://127.0.0.1:8000/storage/foto_barang/${d.foto_barang}`);
        }
      } catch (error) {
        setError(`Gagal mengambil data barang: ${error.message || "Terjadi kesalahan"}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBarang();
  }, [id_barang]);

  useEffect(() => {
    if (!originalData) return;
    const changed =
      formData.nama_barang !== originalData.nama_barang ||
      formData.harga_barang !== originalData.harga_barang ||
      formData.deskripsi !== originalData.deskripsi ||
      formData.berat_barang !== originalData.berat_barang ||
      formData.tanggal_garansi !== originalData.tanggal_garansi ||
      formData.id_kategori !== originalData.id_kategori ||
      formData.foto_barang !== null;
    setIsChanged(changed);
  }, [formData, originalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, foto_barang: file || null }));
    setPreview(file ? URL.createObjectURL(file) : preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nama_barang || !formData.harga_barang || !formData.berat_barang || !formData.id_kategori) {
      setError("Semua field wajib diisi kecuali deskripsi dan foto.");
      return;
    }

    const sendData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "foto_barang") {
        if (value instanceof File) {
          sendData.append(key, value);
        }
      } else if (value !== null && value !== "") {
        sendData.append(key, value);
      }
    });

    try {
      const res = await EditPenitipanBarang(id_barang, sendData);
      setSuccess("Barang berhasil diperbarui!");
      if (onSuccess) onSuccess(res.barang);
      navigate(-1);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Gagal mengupdate data.";
      const errorDetails = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : "";
      setError(`${errorMessage} ${errorDetails}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner as="span" animation="border" variant="success" size="lg" role="status" aria-hidden="true" />
        <p className="mb-0">Loading...</p>
      </div>
    );
  }

  return (
    <Container className="mt-5 mb-5">
      <div className="text-center mb-3 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mt-1 pb-1 hijau" style={{ letterSpacing: "0.5em" }}>
          E D I T
        </h1>
        <h1 className="mt-1 pb-1 hijau" style={{ letterSpacing: "0.5em" }}>
          P E N I T I P A N &nbsp; B A R A N G
        </h1>
      </div>

      <Container
        className="mt-4 mb-5 py-4 rounded-3"
        style={{
          border: "1px solid rgba(83, 83, 83, 1)",
          backgroundColor: "rgba(241, 237, 233, 1)",
          maxWidth: "700px",
        }}
      >
        <Form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "auto" }}>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nama Barang</Form.Label>
                <Form.Control
                  type="text"
                  name="nama_barang"
                  value={formData.nama_barang}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Harga Barang</Form.Label>
                <Form.Control
                  type="number"
                  name="harga_barang"
                  value={formData.harga_barang}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Berat Barang (gram)</Form.Label>
                <Form.Control
                  type="number"
                  name="berat_barang"
                  value={formData.berat_barang}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tanggal Garansi</Form.Label>
                <Form.Control
                  type="date"
                  name="tanggal_garansi"
                  value={formData.tanggal_garansi}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Kategori</Form.Label>
                <Form.Select
                  name="id_kategori"
                  value={formData.id_kategori}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {kategoris.length > 0 ? (
                    kategoris
                      .filter((kategori) => kategori.id_kategori % 10 !== 0)
                      .map((kategori) => (
                        <option key={kategori.id_kategori} value={kategori.id_kategori}>
                          {kategori.nama_kategori}
                        </option>
                      ))
                  ) : (
                    <option disabled>Tidak ada kategori tersedia</option>
                  )}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Deskripsi</Form.Label>
                <Form.Control
                  as="textarea"
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  rows={6}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Foto Barang</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 rounded"
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                )}
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-3 mt-4">
            <Button
              type="submit"
              disabled={!isChanged}
              className="w-100 border-0 btn-lg rounded-5 shadow-sm"
              style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
            >
              Simpan
            </Button>
            <Button
              variant="secondary"
              className="w-100 btn-lg rounded-5 shadow-sm"
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

export default EditPenitipanBarangForm;
