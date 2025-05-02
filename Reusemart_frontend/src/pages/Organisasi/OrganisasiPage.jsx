import { Container, Tab, Tabs, Card, Spinner, Alert, Row, Col, Modal, Button, Form} from "react-bootstrap";
import reusemart from "../../assets/images/titlereuse.png";
import { getProfileData, getRequestDonasiByOrganisasi, deleteRequestById} from "../../api/apiOrganisasi";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputFloatingForm from "../../components/forms/InputFloatingForm";
import { FaSearch } from 'react-icons/fa';

const OrganisasiPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [requestData, setRequestData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await getProfileData();
      setProfileData(profile);
      if (!profile) {
        return (
          <Container className="mt-5 text-center">
            <Alert variant="warning">Data tidak ditemukan</Alert>
          </Container>
        );
      }
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestDonasi = async () => {
    try {
      const data = await getRequestDonasiByOrganisasi();
      setRequestData(data);
    } catch (err) {
      console.error("Gagal ambil data request:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchRequestDonasi();
  }, []);

  const handleDelete = async () => {
      if (!selectedRequest) return;
      await deleteRequestById(selectedRequest.id_request);
      setShowDelete(false);
      fetchRequestDonasi();
    };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Memuat data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 text-center">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-5">
        <div className="text-center mb-4 d-flex flex-row justify-content-center align-items-center gap-3">
            <img src={reusemart} alt="ReuseMart" height="50" />
            <h1 className="mt-1 hijau">O R G A N I S A S I</h1>
        </div>

        <h3 className="text-center text-muted">@{profileData?.nama}</h3>

        <Container className="text-center mt-0 mb-3 p-0 rounded-3 w-50 border">
            <p className="text-muted">Member Since</p>
            <h5>{profileData?.createdAt}</h5>
        </Container>
        
        <Tabs defaultActiveKey="profile" className="mb-4 justify-content-center custom-tabs" fill>
          <Tab eventKey="donasi" title="Donasi Saya">
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
                <Button className="border-0" style={{ backgroundColor: "rgba(4, 121, 2, 1)" }} onClick={() => navigate("/organisasi/organisasiPage/tambahRequest")}>+ Tambah</Button>
            </Col>
          </Row>
            {requestData.length > 0 ? (
              <div>
                {requestData.filter((req) => req.id_request.toString().includes(searchTerm)).map((req) => {
                  const isApproved = req.tanggal_approve !== null;
                  return (
                    <Card key={req.id_request} className="mb-3 shadow-sm">
                      <Card.Body>
                        <Row>
                          <Col>
                            <p className="mb-1 fw-bold">ID Request : {req.id_request}</p>
                            <p className="mb-1 text-muted">Tanggal Request : {req.tanggal_request}</p>
                          </Col>
                          <Col>
                            {isApproved && (
                              <>
                                <p className="mb-1 text-end"><strong>Penerima :</strong> {req.donasi?.nama_penerima}</p>
                                <p className="mb-1 text-end text-muted"><strong>Donated on :</strong> {req.donasi?.tanggal_donasi}</p>
                              </>
                            )}
                          </Col>
                        </Row>
                        <hr className="my-2" />
                        <Row>
                          <p className="mb-1">
                            <strong>REQUEST :</strong> {req.isi_request}
                          </p>
                        </Row>
                        <div className="d-flex justify-content-end gap-2 mt-2">
                          <Button variant="danger" size="sm" disabled={isApproved} onClick={() => { setSelectedRequest(req); setShowDelete(true); }}>Hapus</Button>
                          <Button variant="primary" size="sm" disabled={isApproved} onClick={() => navigate(`/organisasi/organisasiPage/editRequest/${req.id_request}`)}>Edit</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Alert className="text-center" variant="warning">Belum Ada Request Donasi :(</Alert>
            )}
          </Tab>


          <Tab eventKey="profile" title="Profil Saya">
            <Container className="mt-5 mb-0 p-5 rounded-3 w-50" style={{ border: '1px solid rgb(122, 122, 122)', backgroundColor: 'rgb(255, 255, 255)' }}>
              <h4>Nama Organisasi</h4>
              <InputFloatingForm
                value={profileData?.nama}
                disabled
              />
              <h4>Role</h4>
              <InputFloatingForm
                value="Organisasi"
                disabled
              />
              <h4>Email</h4>
              <InputFloatingForm
                value={profileData?.email}
                disabled
              />
              <h4>Alamat</h4>
              <InputFloatingForm
                value={profileData?.alamat_organisasi}
                disabled
              />
              <h4>Password</h4>
              <InputFloatingForm
                value={profileData?.password}
                disabled
              />
              <h6 className="mt-2 mb-4 text-primary">
                  Ubah password? <Link to="/resetPassword">Klik Disini!</Link>
              </h6>
              <h6 className="text-muted">Karena kebijakan privasi kami, peran Anda tidak mengizinkan perubahan profil secara mandiri. Silakan kunjungi kantor kami jika ingin memperbarui data pribadi.</h6>
            </Container>
          </Tab>
      </Tabs>
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hapus Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin menghapus request ini?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>Hapus</Button>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Batal</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrganisasiPage;
