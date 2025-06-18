import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Image, Modal, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetAllRequiredTambahBarang, GetPenitipanDetails, TambahPenitipanBarang } from "../../../api/apiBarang";

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
        harga_barang: 1,
        deskripsi: "",
        berat_barang: 1,
        foto_barang: null,
        foto_barang2: null,
        foto_barang3: null,
        foto_preview: null,
        foto_preview2: null,
        foto_preview3: null,
        foto_barang_preview: null,
        foto_barang2_preview: null,
        foto_barang3_preview: null,
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
      try {
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
      } catch (err) {
        toast.error("Gagal memuat data dropdown.");
      }
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

  const handleFileChange = (e, index, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        barang: prev.barang.map((item, i) =>
          i === index
            ? {
                ...item,
                [field]: file,
                [`${field}_preview`]: URL.createObjectURL(file),
              }
            : item
        ),
      }));
    }
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
          foto_barang2: null,
          foto_barang3: null,
          foto_preview: null,
          foto_preview2: null,
          foto_preview3: null,
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
    const missingPhotos = formData.barang.some(
      (barang) => !barang.foto_barang || !barang.foto_barang2
    );
    if (missingPhotos) {
      toast.error("Semua barang harus memiliki foto utama dan foto kedua.");
      setLoading(false);
      return;
    }
    const payload = new FormData();
    payload.append("id_penitip", formData.id_penitip);
    payload.append("id_qc", formData.id_qc);
    payload.append("id_hunter", formData.id_hunter || "");
    payload.append("isHunting", formData.isHunting);
    formData.barang.forEach((barang, index) => {
      Object.entries(barang).forEach(([key, val]) => {
        if (
          (key === "foto_barang" || key === "foto_barang2" || key === "foto_barang3") &&
          val
        ) {
          payload.append(`barang[${index}][${key}]`, val);
        } else if (!key.includes("preview") && val !== null) {
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
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const textMargin = margin + 5;
      const maxWidth = pageWidth - 2 * margin;
      const halfWidth = pageWidth / 2;
      let yPosition = margin;

      const addText = (text, x, y, fontSize = 12, style = "normal") => {
        pdf.setFont("helvetica", style);
        pdf.setFontSize(fontSize);
        pdf.text(text, x, y, { maxWidth });
        return pdf.getTextDimensions(text, { maxWidth, fontSize }).h;
      };
      yPosition += addText(" ", textMargin, yPosition, 12, "bold");
      yPosition += addText("Reusemart", textMargin, yPosition, 12, "bold");
      yPosition += addText("Jl. Green Eco Park No. 456 Yogyakarta", textMargin, yPosition, 10);
      yPosition += 5;
      yPosition += addText(`No Nota                    : ${fullData.id_penitipan}`, textMargin, yPosition, 10);
      yPosition += addText(`Tanggal Penitipan        : ${new Date(fullData.tanggal_masuk).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`, textMargin, yPosition, 10);
      yPosition += addText(`Masa Penitipan Sampai: ${new Date(fullData.rincian_penitipan[0].tanggal_akhir).toLocaleDateString("id-ID")}`, textMargin, yPosition, 10);
      yPosition += 5;
      yPosition += addText(`Penitip: ${fullData.penitip.id_penitip} / ${fullData.penitip.nama}`, textMargin, yPosition, 10, "bold");
      yPosition += 5;

      const currentDate = new Date("2025-06-02");
      fullData.rincian_penitipan.forEach((rincian) => {
        const itemText = `${rincian.barang.nama_barang.padEnd(30)} ${rincian.barang.harga_barang.toLocaleString("id-ID")}`;
        let garansiText = "";
        if (rincian.barang.tanggal_garansi) {
          const garansiDate = new Date(rincian.barang.tanggal_garansi);
          if (garansiDate >= currentDate) {
            garansiText = `Garansi ON ${garansiDate.toLocaleString("id-ID", { month: "long", year: "numeric" })}`;
          }
        }
        const beratText = `Berat Barang: ${rincian.barang.berat_barang} gram`;
        const requiredHeight = 10 + (garansiText ? 5 : 0) + 5 + 10;
        if (yPosition + requiredHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        yPosition += addText(itemText, textMargin, yPosition, 10);
        if (garansiText) {
          yPosition += addText(garansiText, textMargin, yPosition, 10);
        }
        yPosition += addText(beratText, textMargin, yPosition, 10);
        yPosition += 5;
      });

      if (yPosition + 30 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      yPosition += addText("Diterima dan QC oleh:", textMargin, yPosition, 10);
      yPosition += 15;
      yPosition += addText(`${fullData.qc?.id_pegawai || "N/A"} - ${fullData.qc?.nama || "Unknown"}`, textMargin + 5, yPosition, 10);

      const contentHeight = yPosition - margin + 10;
      pdf.setLineWidth(0.5);
      pdf.rect(margin, margin, halfWidth - margin, contentHeight, "S");

      const pdfBlob = pdf.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank");
      saveAs(pdfBlob, `nota-${fullData.id_penitipan}.pdf`);
      setShowDialog(false);
      toast.success("Nota berhasil diunduh dan dibuka!");
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
              <div style={{ position: "relative", minHeight: "650px" }}>
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
                            {dropdownData.kategori
                              .filter((k) => k.id_kategori % 10 !== 0)
                              .map((k) => (
                                <option key={k.id_kategori} value={k.id_kategori}>
                                  {k.nama_kategori}
                                </option>
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
                          <Form.Label>Berat Barang (gram)</Form.Label>
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
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Upload Foto Barang Utama</Form.Label>
                          <Form.Control
                            type="file"
                            name="foto_barang"
                            onChange={(e) => handleFileChange(e, currentFormIndex, "foto_barang")}
                            accept="image/*"
                            required
                          />
                          {formData.barang[currentFormIndex].foto_barang_preview && (
                            <Image
                              src={formData.barang[currentFormIndex].foto_barang_preview}
                              alt="Preview Utama"
                              className="mt-2 rounded"
                              style={{ maxWidth: "100%", maxHeight: "100px" }}
                            />
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Upload Foto Barang Kedua</Form.Label>
                          <Form.Control
                            type="file"
                            name="foto_barang2"
                            onChange={(e) => handleFileChange(e, currentFormIndex, "foto_barang2")}
                            accept="image/*"
                            required
                          />
                          {formData.barang[currentFormIndex].foto_barang2_preview && (
                            <Image
                              src={formData.barang[currentFormIndex].foto_barang2_preview}
                              alt="Preview Kedua"
                              className="mt-2 rounded"
                              style={{ maxWidth: "100%", maxHeight: "100px" }}
                            />
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Upload Foto Barang Ketiga (Opsional)</Form.Label>
                          <Form.Control
                            type="file"
                            name="foto_barang3"
                            onChange={(e) => handleFileChange(e, currentFormIndex, "foto_barang3")}
                            accept="image/*"
                          />
                          {formData.barang[currentFormIndex].foto_barang3_preview && (
                            <Image
                              src={formData.barang[currentFormIndex].foto_barang3_preview}
                              alt="Preview Ketiga"
                              className="mt-2 rounded"
                              style={{ maxWidth: "100%", maxHeight: "100px" }}
                            />
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} className="d-flex justify-content-end">
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
                      {"<"}
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
                      {">"}
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
            <Button
              variant="success"
              type="submit"
              disabled={loading}
              style={{ padding: "10px 30px", fontSize: "1.1rem" }}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Simpan Penitipan"}
            </Button>
          </div>
        </Form>
      </Container>
      <Modal show={showDialog} onHide={() => {}} backdrop="static" keyboard={false} centered>
        <Modal.Body className="text-center">
          <div className="mb-3">
            <i className="bi bi-check-circle-fill" style={{ fontSize: "3rem", color: "green" }}></i>
          </div>
          <h4>PENITIPAN BERHASIL DIBUAT</h4>
          <p>Nomor Transaksi: {penitipanData?.id_penitipan}</p>
          <p>Terima kasih atas penitipan Anda! Nota akan dicetak. Silakan simpan nota sebagai bukti penitipan.</p>
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