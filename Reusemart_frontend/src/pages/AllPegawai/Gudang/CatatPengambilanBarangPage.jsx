import { useEffect, useState } from "react";
import { Container, Table, Button, Card, Row, Col, Form, Modal, Pagination, Spinner } from "react-bootstrap";
import { FaEye, FaCheck } from "react-icons/fa";
import { useNavigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { GetAllBarangDiambil, AmbilBarang } from "../../../api/apiBarang";

const CatatPengambilanBarangPage = () => {
  const [barangList, setBarangList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [assignData, setAssignData] = useState({ id_rincianpenitipan: null});
  const [selectedBarang, setSelectedBarang] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBarang = async () => {
    setLoading(true);
    const response = await GetAllBarangDiambil();
    console.log("RESPON WOY: ", response);
    const sortedData = response.data.sort((a, b) => a.id_rincianpenitipan - b.id_rincianpenitipan);

    setBarangList(sortedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchBarang();
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


  const totalAmbil= barangList.filter((b) => b.status_penitipan == "Diambil Kembali" && b.barang.status_barang == "Tersedia").length;

  const filteredData = barangList.filter((b) => b.status_penitipan == "Diambil Kembali" && b.barang.status_barang == "Tersedia").filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.id_barang.toString().toLowerCase().includes(term) ||
      b.barang.id_penitip.toString().toLowerCase().includes(term) ||
      b.barang.nama_barang.toLowerCase().includes(term) ||
      b.barang.penitip.nama.toLowerCase().includes(term)
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

  const handleAmbil= (id_rincianpenitipan) => {
    setAssignData({ id_rincianpenitipan});
    setShowKonfirmasi(true);
  };

  const confirmAmbil = async () => {
      const { id_rincianpenitipan } = assignData;
      try {
        await AmbilBarang(id_rincianpenitipan);
        toast.success("Pengambilan berhasil dikonfirmasi");
        setShowKonfirmasi(false);
        setBarangList(prev =>
          prev.map(p =>
            p.id_rincianpenitipan === id_rincianpenitipan ? { ...p.barang, status_barang : "Diambil Kembali"} : p
          )
        );
      } catch (error) {
        toast.error("Gagal mengkonfirmasi pengambilan");
      }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4 d-flex gap-2">
        <Col md={3}>
          <Card style={{backgroundColor:"rgba(4, 121, 2, 1"}} text="white">
            <Card.Body>
              <Card.Title>Jumlah Barang</Card.Title>
              <h3>{totalAmbil}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4 d-flex gap-1">
        <Col md={4}>
          <h3>CATAT PENGAMBILAN</h3>
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
            <th style={{ border: 'none' }}>ID Barang</th>
            <th style={{ border: 'none' }}>Nama Barang</th>
            <th style={{ border: 'none' }}>Nama Penitip</th>
            <th style={{ border: 'none' }}>Batas Akhir</th>
            <th className="text-center" style={{ border: 'none' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((barang) => (
              <tr key={barang.id_rincianpenitipan}>
                <td style={{ border: 'none' }}>{barang.id_barang}</td>
                <td style={{ border: 'none' }}>{barang.barang.nama_barang}</td>
                <td style={{ border: 'none' }}>{barang.barang.penitip.nama}</td>
                <td style={{ border: 'none' }}>{barang.batas_akhir}</td>
                <td style={{ border: 'none' }} className="d-flex justify-content-center gap-3 align-items-center">
                    <Button variant="primary" size="sm" onClick={(e) => {
                        setSelectedBarang(barang);
                        handleAmbil(barang.id_rincianpenitipan);
                    }}
                    >
                        <FaCheck/>
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

    <Outlet />
    </Container>
  );
};

export default CatatPengambilanBarangPage;
