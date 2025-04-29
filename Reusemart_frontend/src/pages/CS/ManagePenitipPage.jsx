import { useEffect, useState } from "react";
import { Container, Table, Button, Card, Row, Col, Form, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
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

  const fetchPenitip = async () => {
    const data = await GetAllPenitip();
    setPenitipList(data);
  };

  useEffect(() => {
    fetchPenitip();
  }, []);

  const handleDelete = async () => {
    if (!selectedPenitip) return;
    await deletePenitipById(selectedPenitip.id);
    setShowDelete(false);
    fetchPenitip();
  };

  const totalTopSeller = penitipList.filter((p) => p.is_top="Ya").length;
  return (
    <Container className="mt-5">
      {/* <div className="text-center mb-3 d-flex flex-row justify-content-center align-items-center gap-3">
        <img src={reusemart} alt="ReuseMart" />
        <h1 className="mt-1 pb-1 hijau">Selamat Datang CS {csName} </h1>
      </div> */}

      <Row className="mb-4 d-flex gap-2">
        <Col md={3}>
          <Card bg="success" text="white">
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
            <Button variant="success" onClick={() => navigate("/pegawai/Customer Service/managePenitip/tambahPenitip")}>+ Tambah</Button>
        </Col>
      </Row>

      <Table bordered hover>
        <thead className="table-success">
          <tr>
            <th>ID</th>
            <th>Nama Penitip</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {penitipList
            .filter((p) => p.nama.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((penitip) => (
              <tr key={penitip.id}>
                <td>{penitip.id_penitip}</td>
                <td>{penitip.nama}</td>
                <td className="d-flex gap-3">
                  <Button variant="success" size="sm" onClick={() => { setSelectedPenitip(penitip); setShowDetail(true); }}>
                    <FaEye />
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => { setSelectedPenitip(penitip); setShowEdit(true); }}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => { setSelectedPenitip(penitip); setShowDelete(true); }}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      {/* Modal Detail */}
      <Modal show={showDetail} onHide={() => setShowDetail(false)}>
        <Modal.Header closeButton>
          <Modal.Title >Detail Penitip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPenitip && (
            <ul>
              <li>{selectedPenitip.nama}</li>
              <li>ID Penitip: {selectedPenitip.id_penitip}</li>
              <li>No KTP: {selectedPenitip.no_ktp}</li>
              <li>Email: {selectedPenitip.email}</li>
            </ul>
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
