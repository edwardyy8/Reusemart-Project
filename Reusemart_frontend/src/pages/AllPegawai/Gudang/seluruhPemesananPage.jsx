import { useEffect, useState } from "react";
import { Container, Table, Button, Card, Row, Col, Form, Modal, Pagination, Spinner } from "react-bootstrap";
import { FaEye, FaCalendarAlt } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import reusemart from "../../../assets/images/titlereuse.png";
import { GetAllPemesanan } from "../../../api/apiPemesanan";

const SeluruhPemesananPage = () => {
  const [pemesananList, setPemesananList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPemesanan, setSelectedPemesanan] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPemesanan = async () => {
    setLoading(true);
    try {
      const response = await GetAllPemesanan();
      console.log("API response:", response);

      const pemesanan = response.data;
      console.log("pemesanan array:", pemesanan);

      const sortedData = pemesanan.sort((a, b) => {
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

  useEffect(() => {
    fetchPemesanan();
  }, []);

  useEffect(() => {
    if (!loading && filteredData.length === 0) {
      toast.warning("Tidak ada pemesanan yang perlu dijadwalkan");
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


  const totalPesanan = pemesananList.length;
  const totalDelivery = pemesananList.filter((p) => p.metode_pengiriman==="kurir").length;
  const totalPickup = pemesananList.filter((p) => p.metode_pengiriman==="pickup").length;
  const belumDijadwalkan = pemesananList.filter((p) => p.tanggal_pengiriman==null && p.jadwal_pengambilan==null).length;

  const filteredData = pemesananList.filter((p) => p.status_pembayaran === "Lunas").filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.id_pemesanan.toString().toLowerCase().includes(term) ||
      p.tanggal_pemesanan.toString().toLowerCase().includes(term) ||
      p.metode_pengiriman.toLowerCase().includes(term)
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
          <Card bg="primary" text="white">
            <Card.Body>
              <Card.Title className="d-flex flex-column">Pesanan Delivery</Card.Title>
              <h3>{totalDelivery}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="warning" text="white">
            <Card.Body>
              <Card.Title className="d-flex flex-column">Pesanan Pickup</Card.Title>
              <h3>{totalPickup}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4 d-flex gap-1">
        <Col md={4}>
          <h3>SELURUH PEMESANAN</h3>
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
            <th style={{ border: 'none' }}>Metode Pengiriman</th>
            <th className="text-center" style={{ border: 'none' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((pemesanan) => (
              <tr key={pemesanan.id}>
                <td style={{ border: 'none' }}>{pemesanan.id_pemesanan}</td>
                <td style={{ border: 'none' }}>{pemesanan.tanggal_pemesanan}</td>
                <td style={{ border: 'none' }}>{pemesanan.tanggal_pelunasan}</td>
                <td style={{ border: 'none' }}>{pemesanan.metode_pengiriman}</td>
                
                <td style={{ border: 'none' }} className="d-flex justify-content-center gap-3 align-items-center">
                  <Button variant="success" size="sm" onClick={() => { setSelectedPemesanan(pemesanan); setShowDetail(true); }}>
                    <FaEye />
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
                                src={`https://laraveledwardy.barioth.web.id/storage/foto_barang/${pemesanan.barang?.foto_barang}`}
                                alt="Foto Barang"
                                height={100}
                                className="rounded-2 mb-1"
                              /> 
                            <div className="d-flex flex-column">
                              <span className="fw-bold">{pemesanan.barang?.nama_barang}</span>  
                              <span>Rp {pemesanan.barang?.harga_barang.toLocaleString()}</span>
                            </div> 
                          </div>
                        </li>
                      ))}
                    </ul>
                    {selectedPemesanan.ongkos == 0 ? (
                      <span>Biaya Pengiriman: Gratis</span>
                    ) : (
                      <span>Biaya Pengiriman: {selectedPemesanan.ongkos}</span>
                    )}
                </div>
              </Col>
            </Row>
            </>
          )}
        </Modal.Body>
      </Modal>

      
      <Outlet />
    </Container>
  );
};

export default SeluruhPemesananPage;
