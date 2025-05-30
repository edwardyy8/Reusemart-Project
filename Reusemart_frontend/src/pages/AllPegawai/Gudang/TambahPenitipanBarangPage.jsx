import React, { useState, useEffect } from "react";
import { Container, Form, Button, Spinner, Card, Row, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TambahPenitipanBarang, GetAllRequiredTambahBarang, GetPenitipanDetails } from "../../../api/apiBarang";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const TambahPenitipanBarangPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id_penitip: "",
    id_qc: "",
    id_hunter: "",
    isHunting: "no",
    barang: [
      {
        id_kategori: "",
        nama_barang: "",
        stok_barang: 1,
        harga_barang: 0,
        deskripsi: "",
        berat_barang: 0,
        foto_barang: null,
        tanggal_garansi: "",
      },
    ],
  });

  const [dropdownData, setDropdownData] = useState({
    pegawai: [],
    kategori: [],
    penitip: [],
    qc: [],
    hunter: [],
  });

  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [penitipanData, setPenitipanData] = useState(null);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);

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
        hunter: hunterFiltered,
      });
    };
    fetchDropdowns();
  }, []);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      setFormData((prev) => ({
        ...prev,
        barang: prev.barang.map((item, i) =>
          i === index ? { ...item, [name]: value } : item
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "isHunting" && value === "no" ? { id_hunter: "" } : {}),
      }));
    }
  };

  const handleFileChange = (e, index) => {
    setFormData((prev) => ({
      ...prev,
      barang: prev.barang.map((item, i) =>
        i === index ? { ...item, foto_barang: e.target.files[0] } : item
      ),
    }));
  };

  const addBarang = () => {
    setFormData((prev) => ({
      ...prev,
      barang: [
        ...prev.barang,
        {
          id_kategori: "",
          nama_barang: "",
          stok_barang: 1,
          harga_barang: 0,
          deskripsi: "",
          berat_barang: 0,
          foto_barang: null,
          tanggal_garansi: "",
        },
      ],
    }));
    setCurrentFormIndex(formData.barang.length);
  };

  const removeBarang = (index) => {
    setFormData((prev) => ({
      ...prev,
      barang: prev.barang.filter((_, i) => i !== index),
    }));
    if (currentFormIndex >= formData.barang.length - 1) {
      setCurrentFormIndex(Math.max(0, formData.barang.length - 2));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append("id_penitip", formData.id_penitip);
    payload.append("id_qc", formData.id_qc);
    payload.append("id_hunter", formData.id_hunter || "");
    payload.append("isHunting", formData.isHunting);

    formData.barang.forEach((barang, index) => {
      Object.entries(barang).forEach(([key, val]) => {
        if (key === "foto_barang" && val) {
          payload.append(`barang[${index}][${key}]`, val);
        } else if (val !== null && key !== "foto_barang") {
          payload.append(`barang[${index}][${key}]`, val);
        }
      });
    });

    try {
      const response = await TambahPenitipanBarang(payload);
      if (!response || !response.id_penitipan) {
        throw new Error("Gagal mendapatkan nomor transaksi dari server.");
      }
      setPenitipanData({ id_penitipan: response.id_penitipan });
      setShowDialog(true);
      toast.success("Penitipan barang berhasil!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Gagal menambahkan penitipan.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintNota = async () => {
    try {
      if (!penitipanData || !penitipanData.id_penitipan) {
        throw new Error("Nomor transaksi tidak tersedia.");
      }
      const penitipanDetails = await GetPenitipanDetails(penitipanData.id_penitipan);
      const fullData = penitipanDetails.status ? penitipanDetails.data : penitipanDetails;

      if (!fullData || !fullData.id_penitipan) {
        throw new Error("Data penitipan tidak valid atau tidak ditemukan.");
      }

      if (!fullData.rincian_penitipan || fullData.rincian_penitipan.length === 0) {
        throw new Error("Tidak ada rincian penitipan untuk dicetak.");
      }

      const notaElement = document.createElement('div');
      notaElement.style.position = 'absolute';
      notaElement.style.left = '-9999px';
      notaElement.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <div style="text-align: left;">
            <h2 style="font-weight: bold; margin-bottom: 5px;">ReUse Mart</h2>
            <p style="margin: 0;">Jl. Green Eco Park No. 456 Yogyakarta</p>
          </div>
          <br/>
          <div style="margin: 20px 0;">
            <p style="margin-bottom: 5px;">No Nota: ${fullData.id_penitipan}</p>
            <p style="margin-bottom: 5px;">Tanggal Penitipan: ${new Date(fullData.tanggal_masuk).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
            <p style="margin-bottom: 5px;">Masa Penitipan Sampai: ${new Date(fullData.rincian_penitipan[0].tanggal_akhir).toLocaleDateString('id-ID')}</p>
            <br/>
            <p style="margin-bottom: 5px;"><strong>Penitip:</strong> ${fullData.penitip.id_penitip} / ${fullData.penitip.nama}</p>
            <p style="margin: 0;">Perumahan Margonda 2/50, Caturtunggal, Depok, Sleman</p>
            <br/>
          </div>
          <div style="margin-bottom: 20px;">
            ${fullData.rincian_penitipan.map((rincian) => `
              <div style="margin-bottom: 15px;">
                <p style="margin: 0; display: flex; justify-content: space-between;">
                  <span>${rincian.barang.nama_barang}</span>
                  <span>${rincian.barang.harga_barang.toLocaleString('id-ID')}</span>
                </p>
                ${rincian.barang.tanggal_garansi ? `
                  <p style="margin: 0;">Garansi ON ${new Date(rincian.barang.tanggal_garansi).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</p>
                ` : ''}
                <p style="margin: 0;">Berat Barang: ${rincian.barang.berat_barang} kg</p>
              </div>
            `).join('')}
          </div>
          <br/>
          <div style="margin-top: 20px;">
            <p style="margin-bottom: 5px;">Diterima dan QC oleh:</p>
            <br/><br/><br/>
            <p style="margin: 0; margin-left: 20px;">${fullData.qc.id_pegawai} - ${fullData.qc.nama}</p>
          </div>
        </div>
      `;
      document.body.appendChild(notaElement);

      const canvas = await html2canvas(notaElement);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`nota-${fullData.id_penitipan}.pdf`);

      document.body.removeChild(notaElement);

      setShowDialog(false);
      toast.success("Nota berhasil diunduh!");
      navigate("/pegawai/Gudang/kelolaPenitipanBarang");
    } catch (err) {
      console.error("Error di handlePrintNota:", err);
      toast.error(err.message || "Gagal mencetak nota.");
    }
  };

  const prevForm = () => {
    setCurrentFormIndex((prev) => Math.max(0, prev - 1));
  };

  const nextForm = () => {
    setCurrentFormIndex((prev) => Math.min(formData.barang.length - 1, prev + 1));
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
      <div className="text-center mb-4">
        <h1 className="mt-1 pb-1 hijau" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
          TAMBAH PENITIPAN BARANG
        </h1>
      </div>

      <Container className="py-5 px-5 rounded-3 w-75" style={{ border: "1px solid #535353", backgroundColor: "#f1ede9" }}>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Row className="mb-5">
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Penitip</Form.Label>
                <Form.Select name="id_penitip" value={formData.id_penitip} onChange={handleChange} required>
                  <option value="">Pilih Penitip</option>
                  {dropdownData.penitip.map((p) => (
                    <option key={p.id_penitip} value={p.id_penitip}>{p.nama}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">QC</Form.Label>
                <Form.Select name="id_qc" value={formData.id_qc} onChange={handleChange} required>
                  <option value="">Pilih QC</option>
                  {dropdownData.qc.map((qc) => (
                    <option key={qc.id_pegawai} value={qc.id_pegawai}>{qc.nama}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Apakah Hasil Hunting?</Form.Label>
                <div>
                  <Form.Check
                    inline
                    label="Ya"
                    name="isHunting"
                    type="radio"
                    value="yes"
                    checked={formData.isHunting === "yes"}
                    onChange={handleChange}
                  />
                  <Form.Check
                    inline
                    label="Tidak"
                    name="isHunting"
                    type="radio"
                    value="no"
                    checked={formData.isHunting === "no"}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
              {formData.isHunting === "yes" && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Hunter</Form.Label>
                  <Form.Select name="id_hunter" value={formData.id_hunter} onChange={handleChange}>
                    <option value="">Pilih Hunter</option>
                    {dropdownData.hunter.map((h) => (
                      <option key={h.id_pegawai} value={h.id_pegawai}>{h.nama}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
            </Col>
          </Row>

          <h4 className="mt-4 mb-4 fw-bold">Daftar Barang</h4>
          <Row className="justify-content-center">
            <Col md={10}>
              <div style={{ position: "relative", minHeight: "550px" }}>
                <Card style={{ border: "1px solid #535353", padding: "25px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Kategori</Form.Label>
                          <Form.Select
                            name="id_kategori"
                            value={formData.barang[currentFormIndex].id_kategori}
                            onChange={(e) => handleChange(e, currentFormIndex)}
                            required
                          >
                            <option value="">Pilih Kategori</option>
                            {dropdownData.kategori.map((k) => (
                              <option key={k.id_kategori} value={k.id_kategori}>{k.nama_kategori}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nama Barang</Form.Label>
                          <Form.Control
                            type="text"
                            name="nama_barang"
                            value={formData.barang[currentFormIndex].nama_barang}
                            onChange={(e) => handleChange(e, currentFormIndex)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Stok Barang</Form.Label>
                          <Form.Control
                            type="number"
                            name="stok_barang"
                            min="1"
                            value={formData.barang[currentFormIndex].stok_barang}
                            onChange={(e) => handleChange(e, currentFormIndex)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Harga Barang</Form.Label>
                          <Form.Control
                            type="number"
                            name="harga_barang"
                            value={formData.barang[currentFormIndex].harga_barang}
                            onChange={(e) => handleChange(e, currentFormIndex)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Deskripsi</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="deskripsi"
                            value={formData.barang[currentFormIndex].deskripsi}
                            onChange={(e) => handleChange(e, currentFormIndex)}
                            required
                            rows={4}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Berat Barang (kg)</Form.Label>
                          <Form.Control
                            type="number"
                            name="berat_barang"
                            value={formData.barang[currentFormIndex].berat_barang}
                            onChange={(e) => handleChange(e, currentFormIndex)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Tanggal Garansi</Form.Label>
                          <Form.Control
                            type="date"
                            name="tanggal_garansi"
                            value={formData.barang[currentFormIndex].tanggal_garansi}
                            onChange={(e) => handleChange(e, currentFormIndex)}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Upload Foto Barang</Form.Label>
                          <Form.Control
                            type="file"
                            name="foto_barang"
                            onChange={(e) => handleFileChange(e, currentFormIndex)}
                            accept="image/*"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="d-flex align-items-end justify-content-end">
                        {formData.barang.length > 1 && (
                          <Button variant="danger" onClick={() => removeBarang(currentFormIndex)} style={{ width: "150px" }}>
                            Hapus Barang
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                <div style={{ position: "absolute", top: "50%", left: "-60px", transform: "translateY(-50%)" }}>
                  {currentFormIndex > 0 && (
                    <Button
                      variant="outline-secondary"
                      onClick={prevForm}
                      style={{ width: "45px", height: "45px", borderRadius: "50%", fontSize: "1.3rem" }}
                    >
                    </Button>
                  )}
                </div>
                <div style={{ position: "absolute", top: "50%", right: "-60px", transform: "translateY(-50%)" }}>
                  {currentFormIndex < formData.barang.length - 1 ? (
                    <Button
                      variant="outline-secondary"
                      onClick={nextForm}
                      style={{ width: "45px", height: "45px", borderRadius: "50%", fontSize: "1.3rem" }}
                    >
                    </Button>
                  ) : (
                    <Button
                      variant="outline-success"
                      onClick={addBarang}
                      style={{ width: "45px", height: "45px", borderRadius: "50%", fontSize: "1.3rem" }}
                    >
                      +
                    </Button>
                  )}
                </div>
                <div className="text-center mt-3">
                  <small style={{ fontSize: "0.9rem", color: "#555" }}>
                    Form {currentFormIndex + 1} dari {formData.barang.length}
                  </small>
                </div>
              </div>
            </Col>
          </Row>

          <div className="text-center mt-5">
            <Button variant="success" type="submit" style={{ padding: "10px 30px", fontSize: "1.1rem" }}>
              Simpan Penitipan
            </Button>
          </div>
        </Form>
      </Container>

      <Modal
        show={showDialog}
        onHide={() => {}}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Body className="text-center">
          <div className="mb-3">
            <i className="bi bi-check-circle-fill" style={{ fontSize: "3rem", color: "green" }}></i>
          </div>
          <h4>PENITIPAN BERHASIL DIBUAT</h4>
          <p>Nomor Transaksi: {penitipanData?.id_penitipan}</p>
          <p>
            Terima kasih atas penitipan Anda! Nota akan dicetak. Silakan simpan nota sebagai bukti penitipan.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="success" onClick={handlePrintNota}>
            Cetak Nota
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TambahPenitipanBarangPage;