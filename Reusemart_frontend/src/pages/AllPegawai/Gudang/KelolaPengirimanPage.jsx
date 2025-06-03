import { useEffect, useState } from "react";
import { Container, Table, Button, Card, Row, Col, Form, Modal, Pagination, Overlay, Popover, Spinner } from "react-bootstrap";
import Datepicker from "../../../components/date/DatePicker";
import { FaEye, FaCalendarAlt } from "react-icons/fa";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { GetAllKurir } from "../../../api/apiPegawai";
import { GetAllDelivery, AssignKurir, UpdateTanggalPengiriman } from "../../../api/apiPemesanan";

const KelolaPengirimanPage = () => {
  const [pemesananList, setPemesananList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [assignData, setAssignData] = useState({ id_pemesanan: null, id_kurir: null });
  const [kurirList, setKurirList] = useState([]);
  const [selectedPemesanan, setSelectedPemesanan] = useState(null);
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [calendarTarget, setCalendarTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  let minDate = new Date();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPemesanan = async () => {
    setLoading(true);
    try{
      const response = await GetAllDelivery();
      const sortedData = response.data.sort((a, b) => {
        const numA = parseInt(a.id_pemesanan.replace(/[^\d]/g, ""));
        const numB = parseInt(b.id_pemesanan.replace(/[^\d]/g, ""));
        return numA - numB;
      });
      setPemesananList(sortedData);
      
    } catch (error) {
      console.error("Gagal mengambil data pengiriman:", error);
      toast.error("Gagal mengambil data pengiriman");
    } finally {
      setLoading(false);
    }
  };

  const fetchKurir = async () => {
    try {
      const response = await GetAllKurir();
      console.log(response);
      setKurirList(response.data);
    } catch (error) {
      console.error("Gagal ambil kurir", error);
    }
  };

  useEffect(() => {
    fetchPemesanan();
    fetchKurir();
  }, []);

  useEffect(() => {
    if (!loading && filteredData.length === 0) {
      toast.warning("Tidak ada pengiriman yang perlu dijadwalkan");
    }
  }, [loading, pemesananList]);

  const formatTanpaDetik = (tanggal) => {
        const date = new Date(tanggal);
        const tahun = date.getFullYear();
        const bulan = String(date.getMonth() + 1).padStart(2, '0');
        const hari = String(date.getDate()).padStart(2, '0');
        const jam = String(date.getHours()).padStart(2, '0');
        const menit = String(date.getMinutes()).padStart(2, '0');
        
        return `${tahun}-${bulan}-${hari} ${jam}:${menit}`;
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Memuat data...</p>
      </Container>
    );
  }


  const totalPesanan = pemesananList.filter((p) => p.tanggal_pengiriman == null).length;

  const filteredData = pemesananList.filter((p) => p.status_pembayaran === "Lunas" && (p.tanggal_pengiriman == null || p.id_kurir == null)).filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.id_pemesanan.toString().toLowerCase().includes(term) ||
      p.tanggal_pemesanan.toString().toLowerCase().includes(term) 
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleKurirChange = (id_pemesanan, id_kurir) => {
    setAssignData({ id_pemesanan, id_kurir });
    setShowKonfirmasi(true);
  };

  const confirmAssign = async () => {
    const { id_pemesanan, id_kurir } = assignData;
    try {
      await AssignKurir(id_pemesanan, id_kurir);
      toast.success("Kurir berhasil ditugaskan");
      setShowKonfirmasi(false);
      setPemesananList(prev =>
        prev.map(p =>
          p.id_pemesanan === id_pemesanan ? { ...p, id_kurir } : p
        )
      );
    } catch (error) {
      toast.error("Gagal menugaskan kurir");
    }
  };

  const getMinDateForKurir = () => {
      const tgl = new Date();
      const jam = tgl.getHours();
      
      if (jam >= 16) {
        // Kalau sudah lewat jam 16, mulai dari besok
        tgl.setDate(tgl.getDate() + 1);
        tgl.setHours(0, 0, 0, 0);
      } else {
        // Kalau sebelum jam 16, hari ini tetap bisa dipilih
        tgl.setHours(0, 0, 0, 0);
      }
  
      return tgl;
  };

  if (selectedPemesanan){
    minDate = getMinDateForKurir();
  }

   
  const handleTanggalConfirm = async (tanggal) => {
    if (!selectedPemesanan) return;
    try {
      const tanggalFormatted = `${tanggal.getFullYear()}-${String(tanggal.getMonth() + 1).padStart(2, "0")}-${String(tanggal.getDate()).padStart(2, "0")} ${String(tanggal.getHours()).padStart(2, "0")}:${String(tanggal.getMinutes()).padStart(2, "0")}:00`;
      await UpdateTanggalPengiriman(selectedPemesanan.id_pemesanan, tanggalFormatted);
      toast.success("Tanggal pengiriman berhasil diperbarui");
      setPemesananList((prev) =>
        prev.map((p) =>
          p.id_pemesanan === selectedPemesanan.id_pemesanan
            ? { ...p, tanggal_pengiriman: tanggalFormatted, status_pengiriman: "Menunggu Kurir" }
            : p
        )
      );
      setShowDatepicker(false);
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui tanggal pengiriman");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4 d-flex gap-2">
        <Col md={3}>
          <Card style={{backgroundColor:"rgba(4, 121, 2, 1)"}} text="white">
            <Card.Body>
              <Card.Title>Jumlah Pesanan</Card.Title>
              <h3>{totalPesanan}</h3>
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
      <Row className="mb-4 d-flex gap-1">
        <Col md={3}>
          <h3>KELOLA PENGIRIMAN</h3>
        </Col>
        <Col>
            <Form.Control
            type="text"
            placeholder="Search"
            className="w-100"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </Col>
      </Row>

      <Table bordered hover className="bg-white">
        <thead className="custom-table">
          <tr>
            <th style={{ border: 'none' }}>No Nota</th>
            <th style={{ border: 'none' }}>Tanggal Pemesanan</th>
            <th style={{ border: 'none' }}>Tanggal Pelunasan</th>
            <th style={{ border: 'none' }}>Penugasan Kurir</th>
            <th className="text-center" style={{ border: 'none' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((pemesanan) => (
              <tr key={pemesanan.id}>
                <td style={{ border: 'none' }}>{pemesanan.id_pemesanan}</td>
                <td style={{ border: 'none' }}>{pemesanan.tanggal_pemesanan}</td>
                <td style={{ border: 'none' }}>{pemesanan.tanggal_pelunasan}</td>
                <td style={{ border: 'none' }}>
                  <Form.Select
                    value={pemesanan.id_kurir || ""}
                    onChange={(e) => handleKurirChange(pemesanan.id_pemesanan, e.target.value)}
                  >
                    <option value="">Pilih kurir</option>
                    {kurirList.map((kurir) => (
                      <option key={kurir.id_pegawai} value={kurir.id_pegawai}>
                        {kurir.nama}
                      </option>
                    ))}
                  </Form.Select>
                </td>
                
                <td style={{ border: 'none' }} className="d-flex justify-content-center gap-3 align-items-center">
                  <Button variant="success" size="sm" onClick={() => { setSelectedPemesanan(pemesanan); setShowDetail(true); }}>
                    <FaEye />
                  </Button>
                  <Button variant="primary" size="sm"
                    ref={(el) => pemesanan.id_pemesanan === selectedPemesanan?.id_pemesanan && setCalendarTarget(el)}
                    onClick={(e) => {
                      setSelectedPemesanan(pemesanan);
                      setCalendarTarget(e.target);
                      setShowDatepicker((prev) => !prev);
                    }}
                    disabled={!pemesanan.id_kurir}
                  >
                  <FaCalendarAlt />
                </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      {filteredData.length > itemsPerPage && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.First 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1} 
            />
            <Pagination.Prev 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1} 
            />
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Pagination.Item
                  key={pageNum}
                  active={pageNum === currentPage}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Pagination.Item>
              );
            })}

            <Pagination.Next 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages} 
            />
            <Pagination.Last 
              onClick={() => handlePageChange(totalPages)} 
              disabled={currentPage === totalPages} 
            />
          </Pagination>
        </div>
      )}

      <Modal show={showDetail} onHide={() => setShowDetail(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detail Pemesanan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPemesanan && (
            <>
            <Row>
              <Col md={12} className="gap-4">
                <h3 className="fw-bold">[ Pesanan {selectedPemesanan.id_pemesanan} ]</h3>
                <div className="d-flex flex-column gap-2">
                  <span>Tanggal Pemesanan: <span className="text-muted">{selectedPemesanan.tanggal_pemesanan}</span></span>
                    <ul className="mb-2 list-unstyled">
                      {selectedPemesanan.rincian_pemesanan?.map((pemesanan, index) => (
                        <li key={index} className="mb-1">
                          <div className="d-flex gap-2">
                            <img
                                src={`http://127.0.0.1:8000/storage/foto_barang/${pemesanan.barang?.foto_barang}`}
                                alt="Foto Barang"
                                height={100}
                                className="rounded-2 mb-2"
                              /> 
                            <div className="d-flex flex-column">
                              <span className="fw-bold">{pemesanan.barang?.nama_barang}</span>  
                              <span>Rp {pemesanan.barang?.harga_barang.toLocaleString()}</span>
                            </div> 
                          </div>
                        </li>
                      ))}
                    </ul>
                </div>
              </Col>
            </Row>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showKonfirmasi} onHide={() => setShowKonfirmasi(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Penugasan Kurir</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin menugaskan kurir ini?</Modal.Body>
        <Modal.Footer>
          <Button className="btnHijau" onClick= {confirmAssign}>Yakin</Button>
          <Button variant="secondary" onClick={() => setShowKonfirmasi(false)}>Batal</Button>
        </Modal.Footer>
      </Modal>

      <Overlay target={calendarTarget} show={showDatepicker} placement="bottom">
        <Popover id="popover-datepicker">
          <Popover.Body>
            <Datepicker
              onConfirm={(date) => {
                handleTanggalConfirm(date);
                setShowDatepicker(false);
              }}
              minDate = {minDate}
              onCancel={() => setShowDatepicker(false)}
            />
          </Popover.Body>
        </Popover>
      </Overlay>

    <Outlet />
    </Container>
  );
};

export default KelolaPengirimanPage;
