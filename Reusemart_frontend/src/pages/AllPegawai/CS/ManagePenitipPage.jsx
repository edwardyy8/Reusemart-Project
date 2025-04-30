import { useEffect, useState } from "react";
import { Container, Table, Button, Card, Row, Col, Form, Modal, Pagination } from "react-bootstrap";
import { FaEye} from "react-icons/fa";
import { FaRegPenToSquare, FaRegTrashCan } from "react-icons/fa6";
import { useNavigate, Outlet } from "react-router-dom";
import reusemart from "../../assets/images/titlereuse.png";
import { GetAllPenitip, deletePenitipById } from "../../api/apiPenitip"; // Sesuaikan dengan path API Anda

const ManagePenitipPage = () => {
  const [penitipList, setPenitipList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedPenitip, setSelectedPenitip] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPenitip = async () => {
    const data = await GetAllPenitip();
    const sortedData = data.sort((a, b) => {
      const numA = parseInt(a.id_penitip.replace(/[^\d]/g, ""));
      const numB = parseInt(b.id_penitip.replace(/[^\d]/g, ""));
      return numA - numB;
    });
    setPenitipList(sortedData);
  };

  useEffect(() => {
    fetchPenitip();
  }, []);

  const handleDelete = async () => {
    if (!selectedPenitip) return;
    await deletePenitipById(selectedPenitip.id_penitip);
    setShowDelete(false);
    fetchPenitip();
  };

  const totalTopSeller = penitipList.filter((p) => p.is_top==="Ya").length;

  const filteredData = penitipList.filter((p) => 
    p.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <Card.Title>Jumlah Penitip</Card.Title>
              <h3>{penitipList.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="primary" text="white">
            <Card.Body>
              <Card.Title className="d-flex flex-column">Jumlah Penitip Top Seller</Card.Title>
              <h3>{totalTopSeller}</h3>
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
        <Col xs="auto">
            <Button className="border-0" style={{ backgroundColor: "rgba(4, 121, 2, 1)" }} onClick={() => navigate("/pegawai/Customer Service/managePenitip/tambahPenitip")}>+ Tambah</Button>
        </Col>
      </Row>

      <Table bordered hover >
        <thead className="custom-table">
          <tr>
            <th style={{ border: 'none' }}>ID Penitip</th>
            <th style={{ border: 'none' }}>Nama Penitip</th>
            <th className="text-center" style={{ border: 'none' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((penitip) => (
              <tr key={penitip.id}>
                <td style={{ border: 'none' }}>{penitip.id_penitip}</td>
                <td style={{ border: 'none' }}>{penitip.nama}</td>
                <td style={{ border: 'none' }} className="d-flex justify-content-center gap-3 align-items-center">
                  <Button variant="success" size="sm" onClick={() => { setSelectedPenitip(penitip); setShowDetail(true); }}>
                    <FaEye />
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => navigate(`/pegawai/Customer Service/managePenitip/editPenitip/${penitip.id_penitip}`)}>
                    <FaRegPenToSquare />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => { setSelectedPenitip(penitip); setShowDelete(true); }}>
                    <FaRegTrashCan />
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
          <Modal.Title >Detail Penitip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPenitip && (
            <>
            <Row>
              <Col md={6} className="gap-4">
                <h3><b>{selectedPenitip.nama}</b></h3>
                <p className="mb-0">ID Penitip: {selectedPenitip.id_penitip}</p>
                <p className="mb-0">No KTP: {selectedPenitip.no_ktp}</p>
                <p>Email: {selectedPenitip.email}</p>
              </Col>
              <Col ms={6} className="d-flex flex-column align-items-end mt-5">
                <img 
                  src={`http://127.0.0.1:8000/storage/foto_ktp/${selectedPenitip.foto_ktp}`}
                  alt="Foto KTP" 
                  style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }} 
                />
              </Col>
            </Row>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Penitip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPenitip && (
            <ul>
              <li>Nama: {selectedPenitip.nama}</li>
              <li>ID Penitip: {selectedPenitip.id_penitip}</li>
              <li>No KTP: {selectedPenitip.no_ktp}</li>
              <li>Email: {selectedPenitip.email}</li>
            </ul>
          )}  
        </Modal.Body>
      </Modal>

      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hapus Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin menghapus data penitip ini?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>Hapus</Button>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Batal</Button>
        </Modal.Footer>
      </Modal>
      <Outlet />
    </Container>
  );
};

export default ManagePenitipPage;
