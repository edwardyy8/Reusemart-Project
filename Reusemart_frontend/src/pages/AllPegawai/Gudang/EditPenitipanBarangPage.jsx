import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert, Spinner, Container, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
    id_penitip: "",
    foto_barang: null,
    id_qc: "",
    id_hunter: "",
    perpanjangan: "",
    status_penitipan: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [kategoris, setKategoris] = useState([]);
  const [penitips, setPenitips] = useState([]);
  const [qcs, setQcs] = useState([]);
  const [hunters, setHunters] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const data = await GetAllRequiredTambahBarang();
        const qcFiltered = data.pegawai?.filter(p => Number(p.id_jabatan) === 6) || [];
        const hunterFiltered = data.pegawai?.filter(p => Number(p.id_jabatan) === 4) || [];
        setKategoris(data.kategori || []);
        setPenitips(data.penitip || []);
        setQcs(qcFiltered);
        setHunters(hunterFiltered);
      } catch (err) {
        setError("Gagal mengambil data dropdown.");
        console.error(err);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const data = await GetPenitipanBarangById(id_barang);
        const d = data.data;
        console.log("Data barang dari API:", d);
        console.log("id_qc:", d.rincian_penitipan?.penitipan?.id_qc);
        console.log("id_hunter:", d.rincian_penitipan?.penitipan?.id_hunter);
        console.log("perpanjangan:", d.rincian_penitipan?.perpanjangan);
        console.log("status_penitipan:", d.rincian_penitipan?.status_penitipan);

        // Periksa apakah id_qc dan id_hunter ada di qcs dan hunters
        const qcExists = qcs.find(qc => qc.id_pegawai === d.rincian_penitipan?.penitipan?.id_qc);
        const hunterExists = hunters.find(hunter => hunter.id_pegawai === d.rincian_penitipan?.penitipan?.id_hunter);
        console.log("QC exists in qcs:", qcExists);
        console.log("Hunter exists in hunters:", hunterExists);

        // Jika rincian_penitipan tidak ada, tampilkan peringatan
        if (!d.rincian_penitipan) {
          toast.warn("Data penitipan tidak ditemukan untuk barang ini. Silakan isi data penitipan.");
        }

        setFormData({
          nama_barang: d.nama_barang || "",
          harga_barang: d.harga_barang ? String(d.harga_barang) : "",
          deskripsi: d.deskripsi || "",
          berat_barang: d.berat_barang ? String(d.berat_barang) : "",
          tanggal_garansi: d.tanggal_garansi || "",
          id_kategori: d.id_kategori ? String(d.id_kategori) : "",
          id_penitip: d.id_penitip || "",
          foto_barang: null,
          id_qc: d.rincian_penitipan && qcExists ? d.rincian_penitipan.penitipan?.id_qc || "" : "",
          id_hunter: d.rincian_penitipan && hunterExists ? d.rincian_penitipan.penitipan?.id_hunter || "" : "",
          perpanjangan: d.rincian_penitipan ? (d.rincian_penitipan.perpanjangan == 1 ? "Ya" : "Tidak") : "Tidak",
          status_penitipan: d.rincian_penitipan ? d.rincian_penitipan.status_penitipan || "" : "",
        });
        setOriginalData({
          nama_barang: d.nama_barang || "",
          harga_barang: d.harga_barang ? String(d.harga_barang) : "",
          deskripsi: d.deskripsi || "",
          berat_barang: d.berat_barang ? String(d.berat_barang) : "",
          tanggal_garansi: d.tanggal_garansi || "",
          id_kategori: d.id_kategori ? String(d.id_kategori) : "",
          id_penitip: d.id_penitip || "",
          id_qc: d.rincian_penitipan && qcExists ? d.rincian_penitipan.penitipan?.id_qc || "" : "",
          id_hunter: d.rincian_penitipan && hunterExists ? d.rincian_penitipan.penitipan?.id_hunter || "" : "",
          perpanjangan: d.rincian_penitipan ? (d.rincian_penitipan.perpanjangan == 1 ? "Ya" : "Tidak") : "Tidak",
          status_penitipan: d.rincian_penitipan ? d.rincian_penitipan.status_penitipan || "" : "",
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
  }, [id_barang, qcs, hunters]);

  useEffect(() => {
    if (!originalData) return;
    const changed = Object.keys(formData).some(
      key => formData[key] !== originalData[key] && !(key === "foto_barang" && formData[key] === null)
    );
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

    if (!formData.nama_barang || !formData.harga_barang || !formData.berat_barang || !formData.id_kategori || !formData.id_penitip) {
      setError("Semua field wajib diisi kecuali deskripsi, foto, dan data penitipan.");
      return;
    }

    const sendData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "foto_barang") {
        if (value instanceof File) {
          sendData.append(key, value);
        }
      } else if (key === "perpanjangan") {
        sendData.append(key, value === "Ya" ? 1 : 0);
      } else if (value !== null && value !== "") {
        sendData.append(key, value);
      }
    });

    try {
      const res = await EditPenitipanBarang(id_barang, sendData);
      setSuccess("Data berhasil diperbarui!");
      toast.success("Data berhasil diedit!");
      if (onSuccess) onSuccess(res);
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
      <div className="text-center mb-4">
        <h1 className="hijau" style={{ letterSpacing: "0.3em" }}>
          EDIT PENITIPAN BARANG
        </h1>
      </div>

      <Card className="shadow-sm" style={{ maxWidth: "900px", margin: "auto" }}>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <h4 className="mb-3">Data Barang</h4>
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
                  <Form.Label>Harga Barang (Rp)</Form.Label>
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
                  <Form.Label>Penitip</Form.Label>
                  <Form.Select
                    name="id_penitip"
                    value={formData.id_penitip}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih Penitip</option>
                    {penitips.length > 0 ? (
                      penitips.map((penitip) => (
                        <option key={penitip.id_penitip} value={penitip.id_penitip}>
                          {penitip.nama} ({penitip.id_penitip})
                        </option>
                      ))
                    ) : (
                      <option disabled>Tidak ada penitip tersedia</option>
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
                    rows={4}
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
                  <Form.Label>Foto Barang</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-2 rounded"
                      style={{ maxWidth: "100%", maxHeight: "150px" }}
                    />
                  )}
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4" />

            <h4 className="mb-3">Data Penitipan</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>QC</Form.Label>
                  <Form.Select
                    name="id_qc"
                    value={formData.id_qc || ""}
                    onChange={handleChange}
                  >
                    <option value="">Pilih QC</option>
                    {qcs.length > 0 ? (
                      qcs.map((qc) => (
                        <option key={qc.id_pegawai} value={qc.id_pegawai}>
                          {qc.nama || qc.nama_pegawai} ({qc.id_pegawai})
                        </option>
                      ))
                    ) : (
                      <option disabled>Tidak ada QC tersedia</option>
                    )}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Hunter</Form.Label>
                  <Form.Select
                    name="id_hunter"
                    value={formData.id_hunter || ""}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Hunter</option>
                    {hunters.length > 0 ? (
                      hunters.map((hunter) => (
                        <option key={hunter.id_pegawai} value={hunter.id_pegawai}>
                          {hunter.nama || hunter.nama_pegawai} ({hunter.id_pegawai})
                        </option>
                      ))
                    ) : (
                      <option disabled>Tidak ada Hunter tersedia</option>
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Perpanjangan</Form.Label>
                  <Form.Select
                    name="perpanjangan"
                    value={formData.perpanjangan}
                    onChange={handleChange}
                  >
                    <option value="Ya">Ya</option>
                    <option value="Tidak">Tidak</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status Penitipan</Form.Label>
                  <Form.Select
                    name="status_penitipan"
                    value={formData.status_penitipan || ""}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Status</option>
                    <option value="Sedang Dititipkan">Sedang Dititipkan</option>
                    <option value="Barang Untuk Donasi">Barang Untuk Donasi</option>
                    <option value="Diambil Kembali">Diambil Kembali</option>
                  </Form.Select>
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditPenitipanBarangForm;