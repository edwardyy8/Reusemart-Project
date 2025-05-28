import { useEffect, useState, useRef } from "react";
import { Container, Table, Button, Card, Row, Col, Form, Modal, Pagination, Spinner, Alert } from "react-bootstrap";
import { FaCheck, FaEye } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import SwiperPemesanan from "../../../components/SwiperPemesanan";


import { VerifikasiBuktiPembayaran, GetPemesananUntukVerifikasi, GetFotoBukti } from "../../../api/apiPemesanan";

const VerfikasiPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pemesananList, setPemesananList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showTerima, setShowTerima] = useState(false);
  const [showTolak, setShowTolak] = useState(false);
  const [selectedPemesanan, setSelectedPemesanan] = useState(null);
  const [ImageUrls, setImageUrls] = useState({}); 
  const swiperRef = useRef(null);

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPemesanan = async () => {
   try {
      setIsLoading(true);

      const data = await GetPemesananUntukVerifikasi();

      setPemesananList(data.data);

    } catch (error) {
        console.error("Error fetching pemesanan data:", error);
        toast.error("Gagal memuat data pemesanan");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPemesanan();
  }, []);

  useEffect(() => {
    const fetchImageUrls = async () => {
      const newImageUrls = {};

      await Promise.all(pemesananList.map(async (item) => {
        try {
          const blob = await GetFotoBukti(item.foto_bukti);
          const url = URL.createObjectURL(blob);
          newImageUrls[item.foto_bukti] = url;
        } catch (error) {
          console.error(`Gagal ambil gambar untuk ${item.foto_bukti}:`, error);
        }
      }));

      setImageUrls(newImageUrls);
    };

    if (pemesananList.length > 0) {
      fetchImageUrls();
    }
  }, [pemesananList]);


  const handleTolak = async () => {
    if (!selectedPemesanan) return;

    try {
      setIsLoading(true);
      const data = {status: false};
      const response = await VerifikasiBuktiPembayaran(selectedPemesanan.id_pemesanan, data);
      
      toast.success("Bukti pembayaran berhasil ditolak");
      setShowTolak(false);
      fetchPemesanan();
      setSelectedPemesanan(null);
    } catch (error) {
      console.error("Error menolak bukti pembayaran:", error);
      toast.error("Gagal menolak bukti pembayaran");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerima = async () => {
    if (!selectedPemesanan) return;

    try {
      setIsLoading(true);
      const data = {status: true};

      const response = await VerifikasiBuktiPembayaran(selectedPemesanan.id_pemesanan, data);
      
      toast.success("Bukti pembayaran berhasil diterima");
      setShowTerima(false);
      fetchPemesanan();
      setSelectedPemesanan(null);
    } catch (error) {
      console.error("Error menerima bukti pembayaran:", error);
      toast.error("Gagal menerima bukti pembayaran");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = pemesananList.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.id_pemesanan.toLowerCase().includes(term) ||
      p.pembeli.nama.toLowerCase().includes(term) ||
      p.tanggal_pemesanan.toString().toLowerCase().includes(term) ||
      p.total_harga.toString().toLowerCase().includes(term) ||
      p.rincian_pemesanan.some((item) =>
        item.barang.nama_barang.toLowerCase().includes(term)
      )
      
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

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
          <Spinner as="span" animation="border" variant="success" size="lg" role="status" aria-hidden="true"/>
          <p className="mb-0"> Loading...</p>
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="mb-4 d-flex gap-2">
        <Col md={3}>
          <Card style={{backgroundColor:"rgba(4, 121, 2, 1"}} text="white">
            <Card.Body>
              <Card.Title>Jumlah Pesanan yang belum di verifikasi</Card.Title>
              <h3>{pemesananList.length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4 d-flex align-items-end">
        <Col>
            <Form.Control
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </Col>
      </Row>

      <h3 className="fw-bold mb-3">Verifikasi Bukti Bayar</h3>
      {currentItems.length === 0 ? (
        <Alert variant="warning" className="text-center">
          <h5>Belum ada pemesanan yang butuh verifikasi</h5>
        </Alert>
      ) : (
        <>
          <Table bordered hover >
            <thead className="custom-table text-center">
              <tr>
                <th style={{ border: 'none' }}>ID Pemesanan</th>
                <th style={{ border: 'none' }}>Nama Pembeli</th>
                <th style={{ border: 'none' }}>List Barang</th>
                <th style={{ border: 'none' }}>Tanggal Pemesanan</th>
                <th style={{ border: 'none' }}>Total Harga</th>
                <th style={{ border: 'none' }}>Foto Bukti</th>
                <th className="text-center" style={{ border: 'none' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              
              {currentItems.map((pemesanan) => (
                <tr key={pemesanan.id_pemesanan} className="align-middle text-center">
                  <td style={{ border: 'none' }}>{pemesanan.id_pemesanan}</td>
                  <td style={{ border: 'none' }}>{pemesanan.pembeli.nama}</td>
                  <td style={{ border: 'none' }}>
                    <ul>
                    {pemesanan.rincian_pemesanan.map((rp, index) => (
                      <div key={index}>
                        <li>
                          {rp.barang.nama_barang}
                        </li>
                      </div>
                    ))}
                    </ul>
                  </td>
                  <td style={{ border: 'none' }}>{pemesanan.tanggal_pemesanan}</td>
                  <td style={{ border: 'none' }}>Rp{pemesanan.total_harga.toLocaleString('id-ID')}</td>
                  <td style={{ border: 'none' }}>
                    <img src={ImageUrls[pemesanan.foto_bukti]} alt="foto_bukti" style={{maxHeight: "150px", maxWidth: "150px" }} />
                  </td>
                  <td style={{ border: 'none' }} >
                    <Button variant="primary" className="me-2" size="sm" onClick={() => { setSelectedPemesanan(pemesanan); setShowDetail(true); }}>
                      <FaEye/>
                    </Button>
                    <Button variant="success" className="me-2" size="sm" onClick={() => { setSelectedPemesanan(pemesanan); setShowTerima(true); }}>
                      <FaCheck />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => { setSelectedPemesanan(pemesanan); setShowTolak(true); }}>
                      <FaXmark />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}

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

      <Modal size="lg" show={showDetail} onHide={() => setShowDetail(false)} centered 
        onEntered={() => swiperRef.current?.swiper.update()}
      >
        <Modal.Header closeButton>
          <Modal.Title >Detail pemesanan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPemesanan && (
            <>
            <Row className="p-1">
              <Col lg={8} md={12} sm={12} className="gap-4">
                <h3><b>{selectedPemesanan.pembeli.nama}</b></h3>
                <p className="mb-0">ID Pemesanan: {selectedPemesanan.id_pemesanan}</p>
                <p className="mb-0">Tanggal pemesanan: {selectedPemesanan.tanggal_pemesanan}</p>
                <p className="mb-0">Total Harga: Rp{selectedPemesanan.total_harga.toLocaleString('id-ID')}</p>
                <p>Metode Pengiriman: {selectedPemesanan.metode_pengiriman}</p>
                
              </Col>
              <Col lg={4} md={12} sm={12} className="text-center">
                <img src={ImageUrls[selectedPemesanan.foto_bukti]} alt="foto_bukti" style={{maxHeight: "200px", maxWidth: "200px" }} />
              </Col>
            </Row>
            <Row className="p-1">
              <p className="mt-1 h4">List Barang:</p>
              {showDetail && (  
                <SwiperPemesanan selectedPemesanan={selectedPemesanan} show={showDetail} />
              )}
            </Row>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showTerima} onHide={() => setShowTerima(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Terima Verifikasi Bukti Bayar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menerima bukti transfer ini?
          <br />
          <span className="h4 fw-bold">{selectedPemesanan?.id_pemesanan}</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => handleTerima()}>Yakin</Button>
          <Button variant="secondary" onClick={() => setShowTerima(false)}>Batal</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTolak} onHide={() => setShowTolak(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tolak Verifikasi Bukti Bayar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menolak bukti transfer ini?
          <br />
          <span className="h4 fw-bold">{selectedPemesanan?.id_pemesanan}</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleTolak()}>Yakin</Button>
          <Button variant="secondary" onClick={() => setShowTolak(false)}>Batal</Button>
        </Modal.Footer>
      </Modal>

      
      <Outlet />
    </Container>
  );
};

export default VerfikasiPage;
