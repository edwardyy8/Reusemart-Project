import { useEffect, useState, useRef } from "react";
import { Container, Table, Button, Card, Row, Col, Form, Modal, Pagination, Spinner } from "react-bootstrap";
import { FaPrint } from "react-icons/fa6";
import { useNavigate, Outlet } from "react-router-dom";
import { useReactToPrint } from 'react-to-print';
import NotaKurir from '../../../components/notas/NotaKurir';
import NotaPickup from '../../../components/notas/NotaPickup';
import { toast } from "react-toastify";
import { GetAllPemesananUntukNota, ShowNota, HitungHasil } from "../../../api/apiPemesanan";


const CetakNotaPage = ({pemesanan}) => {
  const [pemesananList, setPemesananList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPemesanan, setSelectedPemesanan] = useState(null);
  const [printNota, setPrintNota] = useState(null);
  const navigate = useNavigate();
  const refPickup = useRef(null);
  const refKurir = useRef(null);
  const handlePrintKurir  = useReactToPrint({ contentRef: refKurir });
  const handlePrintPickup = useReactToPrint({ contentRef: refPickup });
  const [alamatDef, setAlamatDef] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPemesanan = async () => {
    setLoading(true);
    try{
      const response = await GetAllPemesananUntukNota();
      console.log("API response:", response);

      const pemesanan = response.data;
      console.log("pemesanan array:", pemesanan);

      const sortedData = pemesanan.sort((a, b) => {
        const numA = parseInt(a.id_pemesanan.replace(/[^\d]/g, ""));
        const numB = parseInt(b.id_pemesanan.replace(/[^\d]/g, ""));
        return numA - numB;
      });
      setPemesananList(sortedData);
      setAlamatDef(response.alamatDef);
    } catch (error) {
      toast.error("Gagal memuat data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPemesanan();
  }, []);

 useEffect(() => {
    if (!loading && filteredData.length === 0) {
      toast.warning("Tidak ada nota yang perlu dicetak");
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

  const totalPesanan = pemesananList.filter((p) => p.rincian_pemesanan[0]?.komisi_reusemart == 0).length;
  const totalDelivery = pemesananList.filter((p) => p.rincian_pemesanan[0]?.komisi_reusemart == 0 && p.metode_pengiriman.trim().toLowerCase()==="kurir").length;
  const totalPickup = pemesananList.filter((p) => p.rincian_pemesanan[0]?.komisi_reusemart == 0 && p.metode_pengiriman.trim().toLowerCase()==="pickup").length;

  const filteredData = pemesananList.filter((p) => p.status_pembayaran === "Lunas" && p.rincian_pemesanan[0]?.komisi_reusemart == 0).filter((p) => {
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

  const onClickPrint = async (pemesanan) => {
    try {
      await HitungHasil(pemesanan.id_pemesanan);
      const response = await ShowNota(pemesanan.id_pemesanan);
      const nota = { 
        ...response,
        metode_pengiriman: response.metode_pengiriman || pemesanan.metode_pengiriman 
      };
      console.log("Data:", nota);
      setPrintNota(nota);
    } catch (error) {
      toast.error("Gagal mengambil data nota: " + error.message);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
  if (!printNota) return;

  const metode = printNota.metode_pengiriman?.trim()?.toLowerCase();

  const checkAndPrint = () => {
    const componentRef = metode === "kurir" ? refKurir : refPickup;
    const node = componentRef.current;
    if (node && node.offsetHeight > 0) {
      setTimeout(() => {
        if (metode === "kurir") {
          handlePrintKurir();
        } else {
          handlePrintPickup();
        }
        setPrintNota(null);
      }, 500);
    } else {
      setTimeout(checkAndPrint, 100);
    }
  };

  checkAndPrint();
}, [printNota]);

if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Memuat data...</p>
      </Container>
    );
  }

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
        <Col md={2}>
          <h3>CETAK NOTA</h3>
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
            <th style={{ border: 'none' }}>Metode Pengiriman</th>
            <th className="text-center" style={{ border: 'none' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((pemesanan) => (
            <tr key={pemesanan.id}>
              <td style={{ border: 'none' }}>{pemesanan.id_pemesanan}</td>
              <td style={{ border: 'none' }}>{pemesanan.tanggal_pemesanan}</td>
              <td style={{ border: 'none' }}>{pemesanan.metode_pengiriman}</td>
              <td style={{ border: 'none' }} className="d-flex justify-content-center gap-3 align-items-center">
               
                <Button variant="primary" size="sm" onClick={() => {
                    setSelectedPemesanan(pemesanan);
                    setShowKonfirmasi(true);
                  }}>
                  <FaPrint />
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
              <Col md={8} className="gap-4">
                <h3><b> [ Pesanan {selectedPemesanan.id_pemesanan} ]</b></h3>
                <div className="d-flex flex-column gap-1">
                  <span>Nama Barang:</span>
                    <ul className="text-muted mb-2">
                      {selectedPemesanan.rincian_pemesanan?.map((p, index) => (
                        <li key={index}>{p.barang?.nama_barang}</li>
                      ))}
                    </ul>
                  <span>Tanggal Pemesanan: <span className="text-muted">{selectedPemesanan.tanggal_pemesanan}</span></span>
                  {selectedPemesanan.metode_pengiriman.trim().toLowerCase() === "kurir" ? (
                    <span>Tanggal Pengiriman: <span className="text-muted">{formatTanpaDetik(selectedPemesanan.tanggal_pengiriman)}</span></span>
                  ) : (
                    <>
                        <span>Jadwal Pengambilan: <span className="text-muted">{formatTanpaDetik(selectedPemesanan.jadwal_pengambilan)}</span></span>
                        <span>Batas Pengambilan: <span className="text-muted">{formatTanpaDetik(selectedPemesanan.batas_pengambilan)}</span></span>
                    </>
                  )}
                  <span>Status Pengiriman: <span className="text-muted">{selectedPemesanan.status_pengiriman}</span></span>
                  
                </div>
              </Col>
            </Row>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showKonfirmasi} onHide={() => setShowKonfirmasi(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cetak Nota</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin mencetak nota ini?</Modal.Body>
        <Modal.Footer>
          <Button className="btnHijau" onClick={() => {
              onClickPrint(selectedPemesanan);
              setShowKonfirmasi(false);
            }}>Yakin
          </Button>
          <Button variant="secondary" onClick={() => setShowKonfirmasi(false)}>Batal</Button>
        </Modal.Footer>
      </Modal>

      {printNota && (
        <div style={{ position: 'absolute', left: '-9999px' }}>
          <NotaKurir
            ref={refKurir}
            pemesanan={printNota?.metode_pengiriman?.trim?.().toLowerCase() === 'kurir' ? printNota : null}
          />
          <NotaPickup
            ref={refPickup}
            pemesanan={printNota?.metode_pengiriman?.trim?.().toLowerCase() === 'pickup' ? printNota : null}
          />
        </div>

      )}

      <Outlet />
    </Container>
  );
};

export default CetakNotaPage;
