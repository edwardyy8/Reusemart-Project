import { useEffect, useState } from "react";
import { Container, Table, Button, Card, Row, Col, Form, Modal, Pagination, Overlay, Popover, Spinner } from "react-bootstrap";
import Datepicker from "../../../components/date/DatePicker";
import { FaEye, FaCalendarAlt, FaCheck } from "react-icons/fa";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { GetAllPickup, UpdateTanggalPengambilan, AmbilPemesanan } from "../../../api/apiPemesanan";

const KelolaPickupPage = () => {
  const [pemesananList, setPemesananList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [assignData, setAssignData] = useState({ id_pemesanan: null});
  const [selectedPemesanan, setSelectedPemesanan] = useState(null);
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [calendarTarget, setCalendarTarget] = useState(null);
  const navigate = useNavigate();
  let minDate = new Date();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPemesanan = async () => {
    setLoading(true);
    const response = await GetAllPickup();
    const sortedData = response.data.sort((a, b) => {
      const numA = parseInt(a.id_pemesanan.replace(/[^\d]/g, ""));
      const numB = parseInt(b.id_pemesanan.replace(/[^\d]/g, ""));
      return numA - numB;
    });
    setPemesananList(sortedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchPemesanan();
  }, []);

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


  const totalPesanan = pemesananList.filter((p) => p.status_pengiriman != "Transaksi Selesai").length;
  const belumDijadwalkan = pemesananList.filter((p) => p.jadwal_pengambilan === null).length;

  const filteredData = pemesananList.filter((p) => p.status_pembayaran === "Lunas" && p.status_pengiriman != "Transaksi Selesai").filter((p) => {
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

  const handleAmbilPesanan = (id_pemesanan) => {
    setAssignData({ id_pemesanan});
    setShowKonfirmasi(true);
  };

  const confirmAmbil = async () => {
      const { id_pemesanan } = assignData;
      try {
        await AmbilPemesanan(id_pemesanan);
        toast.success("Pengambilan berhasil dikonfirmasi");
        setShowKonfirmasi(false);
        setPemesananList(prev =>
          prev.map(p =>
            p.id_pemesanan === id_pemesanan ? { ...p, status_pengiriman : "Transaksi Selesai"} : p
          )
        );
      } catch (error) {
        toast.error("Gagal mengkonfirmasi pengambilan");
      }
  };

  const getMinDateForPickup = () => {
    const tgl = new Date();
    tgl.setDate(tgl.getDate());
    tgl.setHours(0, 0, 0, 0);
    return tgl;
  };

  if (selectedPemesanan){
    minDate = getMinDateForPickup();
  }
    
  const handleTanggalConfirm = async (tanggal) => {
    if (!selectedPemesanan) return;
    try {
      const tanggalFormatted = `${tanggal.getFullYear()}-${String(tanggal.getMonth() + 1).padStart(2, "0")}-${String(tanggal.getDate()).padStart(2, "0")} ${String(tanggal.getHours()).padStart(2, "0")}:${String(tanggal.getMinutes()).padStart(2, "0")}:00`;
      await UpdateTanggalPengambilan(selectedPemesanan.id_pemesanan, tanggalFormatted);
      toast.success("Jadwal pengambilan berhasil diperbarui");
      setPemesananList((prev) =>
        prev.map((p) =>
          p.id_pemesanan === selectedPemesanan.id_pemesanan
            ? { ...p, tanggal_pengiriman: tanggalFormatted }
            : p
        )
      );
      setShowDatepicker(false);
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui tanggal pengambilan");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4 d-flex gap-2">
        <Col md={3}>
          <Card style={{backgroundColor:"rgba(4, 121, 2, 1"}} text="white">
            <Card.Body>
              <Card.Title>Jumlah Pesanan</Card.Title>
              <h3>{totalPesanan}</h3>
            </Card.Body>
          </Card>
        </Col>
         <Col md={3}>
          <Card bg="danger" text="white">
            <Card.Body>
              <Card.Title className="d-flex flex-column">Pengambilan Belum Dijadwalkan</Card.Title>
              <h3>{belumDijadwalkan}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4 d-flex gap-1">
        <Col md={4}>
          <h3>KELOLA PENGAMBILAN</h3>
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

      <Table bordered hover >
        <thead className="custom-table">
          <tr>
            <th style={{ border: 'none' }}>No Nota</th>
            <th style={{ border: 'none' }}>Tanggal Pemesanan</th>
            <th style={{ border: 'none' }}>Tanggal Pelunasan</th>
            <th className="text-center" style={{ border: 'none' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((pemesanan) => (
              <tr key={pemesanan.id}>
                <td style={{ border: 'none' }}>{pemesanan.id_pemesanan}</td>
                <td style={{ border: 'none' }}>{pemesanan.tanggal_pemesanan}</td>
                <td style={{ border: 'none' }}>{pemesanan.tanggal_pelunasan}</td>
                <td style={{ border: 'none' }} className="d-flex justify-content-center gap-3 align-items-center">
                  {pemesanan.jadwal_pengambilan == null ? (
                    <>
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
                      >
                        <FaCalendarAlt />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="success" size="sm" onClick={() => { setSelectedPemesanan(pemesanan); setShowDetail(true); }}>
                        <FaEye />
                      </Button>
                      <Button variant="primary" size="sm"
                        onClick={(e) => {
                          setSelectedPemesanan(pemesanan);
                          handleAmbilPesanan(pemesanan.id_pemesanan);
                        }}
                      >
                        <FaCheck/>
                      </Button>
                    </>
                  )}
                  
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
                <h3 className="fw-bold"> [ Pesanan {selectedPemesanan.id_pemesanan} ]</h3>
                <div className="d-flex flex-column gap-0">
                 {selectedPemesanan.jadwal_pengambilan == null ? (
                    <>
                      <span>Tanggal Pemesanan: <span className="text-muted">{formatTanpaDetik(selectedPemesanan.tanggal_pemesanan)}</span></span>
                      <span>Tanggal Pelunasan: <span className="text-muted">{formatTanpaDetik(selectedPemesanan.tanggal_pelunasan)}</span></span>  
                    </>
                  ) : (
                    <>
                      <span>Jadwal Pengambilan: <span className="text-muted">{formatTanpaDetik(selectedPemesanan.jadwal_pengambilan)}</span></span>
                      <span>Batas Pengambilan: <span className="text-muted">{formatTanpaDetik(selectedPemesanan.batas_pengambilan)}</span></span>
                    </>
                  )}   
                </div>
                <div className="d-flex flex-column gap-1 mt-3">
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
          <Modal.Title>Konfirmasi Pengambilan</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin mengkonfirmasi pengambilan?</Modal.Body>
        <Modal.Footer>
          <Button className="btnHijau" onClick= {confirmAmbil}>Yakin</Button>
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

export default KelolaPickupPage;
