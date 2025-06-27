import { Container, Tab, Tabs, Card, Spinner, Alert, Row, Col, Button, Badge, Form, Modal } from "react-bootstrap";
import reusemart from "../../assets/images/titlereuse.png";
import { getProfileData } from "../../api/apiPembeli";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import InputFloatingForm from "../../components/forms/InputFloatingForm";
import { GetAlamatByIdPembeli } from "../../api/apiAlamat";

import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { BsCaretRightFill } from "react-icons/bs";
import ModalDeleteAlm from "../../components/modals/alamat/ModalDeleteAlm";
import ModalSelectAlm from "../../components/modals/alamat/ModalSelectAlm";

const UbahAlamatPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const selectedAlamat = location.state?.alamat || null;

    const [profileData, setProfileData] = useState(null);
    const [alamatData, setAlamatData] = useState([]);
    const [alamatCheckout, setAlamatCheckout] = useState(null);
    
    const [error, setError] = useState(null);
    const [loadingAlm, setLoadingAlm] = useState(true);

    const [searchAlamat, setSearchAlamat] = useState("");
    const [filteredAlamat, setFilteredAlamat] = useState([]);

    const fetchProfile = async () => {
      try {
        setLoadingAlm(true);
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
        setLoadingAlm(false);
      }
    };

    const fetchAlamat = async () => {
      try {
        setLoadingAlm(true);

        const alamat = await GetAlamatByIdPembeli(profileData.id_pembeli);
        if (!alamat) {
          return (
            <Container className="mt-5 text-center">
              <Alert variant="warning">Data Alamat tidak ditemukan</Alert>
            </Container>
          );
        }

        console.log("alamat", selectedAlamat);
        if(selectedAlamat) {
          setAlamatCheckout(selectedAlamat);
        }else {
          navigate("/pembeli/profile"); 
        }

        setAlamatData(alamat.data);
      } catch (err) {
        console.log(err);
        setError(err?.response?.data?.message || err.message || "Gagal memuat data");
      } finally {
        setLoadingAlm(false);
      }
    };

    useEffect(() => {
      fetchProfile();
    }, []);

    useEffect(() => {
       if (profileData) {
          fetchAlamat();
       } 

    }, [profileData]);
    
    const handleSearchAlamatChange = (e) => {
      e.preventDefault();

      const keyword = e.target.value;
      setSearchAlamat(keyword);
      
      const filtered = alamatData.filter((alm) =>
        alm.nama_penerima.toLowerCase().includes(keyword.toLowerCase()) ||
        alm.label_alamat.toLowerCase().includes(keyword.toLowerCase())
      );
      
      setFilteredAlamat(filtered);
    };

    if (loadingAlm) { 
        return(
          <Container style={{  
            minHeight: "100vh", 
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
            }}>
              <div className="text-center">
                <Spinner
                    as="span"
                    animation="border"
                    variant="success"
                    size="lg"
                    role="status"
                    aria-hidden="true"
                />
                <p className="mb-0">Loading...</p>
              </div>
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
        <>
            <Container fluid className="py-3 shadow-sm my-3 abu83 px-5" style={{ backgroundColor: "rgba(252, 251, 249, 1)" }}>
                <div className="d-flex align-items-center">
                    <h5 className="mb-0">ALAMAT</h5>
                    <BsCaretRightFill className="ms-2" />
                </div>
            </Container>

            <Container className="mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="hijau mb-0">Silahkan pilih alamat yang ingin dipakai</h4>
                    <Button variant="secondary" className="mt-3 border-0 btn-lg shadow-sm" onClick={() => navigate('/pembeli/checkout')}>
                        Batal pilih
                    </Button>
                </div>

                {loadingAlm ? (
                    <Container style={{  
                        minHeight: "100vh", 
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                        }}>
                        <div className="text-center">
                            <Spinner
                                as="span"
                                animation="border"
                                variant="success"
                                size="lg"
                                role="status"
                                aria-hidden="true"
                            />
                            <p className="mb-0">Loading...</p>
                        </div>
                    </Container>
                    ) : (
                    <>
                        <div className="d-flex flex-row mb-3">
                        {/* Search barnya */}
                        <Form className="d-flex my-2 my-lg-0 position-relative w-100" style={{ minWidth: "300px" }} onSubmit={(e) => e.preventDefault()} >
                            <Button
                                type="submit"
                                variant="link"
                                className="hijau position-absolute start-0 top-50 translate-middle-y bg-transparent border-0"
                                style={{
                                    transform: 'translateY(-50%)',
                                    padding: '0.375rem 0.75rem',
                                    zIndex: 2
                                }}
                                onClick={(e) => e.preventDefault()}
                            >
                                <FaSearch />
                            </Button>
                            <Form.Control
                            type="search"
                            placeholder="Cari label alamat atau nama penerima..."
                            value={searchAlamat}
                            onChange={handleSearchAlamatChange}
                            className="ps-5 "
                            aria-label="Search"
                            style={{
                                paddingLeft: '2.5rem',
                                borderColor: 'rgba(83, 83, 83, 1)',
                            }}
                            />
                        </Form>
                        <Button className="btnHijau ms-3" onClick={() => navigate("/pembeli/tambahAlamat")}>
                            +Tambah
                        </Button>
                        </div>
                        {(searchAlamat === "" ? alamatData : filteredAlamat).length > 0 ? (
                        <Row className="g-3 mb-5">
                            {(searchAlamat === "" ? alamatData : filteredAlamat).map((alamat, idx) => (
                            <Col md={12} sm={12} xs={12} lg={12} key={idx}>
                                <Card className="h-100 w-100">
                                <Card.Body>
                                    <div className="d-flex mb-0 justify-content-between align-items-center">
                                    <div className="d-flex flex-row">
                                        <p className="h5 fw-bold me-2 mb-0">{alamat.nama_penerima}</p>
                                        <p className="text-muted mb-0">({alamat.label_alamat})</p>
                                    </div>
                                    {alamat.is_default == 1 ? ( 
                                        <Badge className="ms-auto p-2 defaultBadge"><p className="mb-0 h6">Default</p></Badge>
                                      ) : null
                                    }
                                    {alamatCheckout.id_alamat === alamat.id_alamat ? (
                                        <Badge className="ms-2 p-2 bg-success"><p className="mb-0 h6">Dipilih</p></Badge>
                                      ) : null
                                    }
                                    </div>
                                    <div className="mt-1">
                                    <p className="text-muted mb-0">{alamat.no_hp}</p>
                                    <p className="text-muted mb-0">{alamat.nama_alamat}</p>
                                    </div>
                                </Card.Body>
                                <Card.Footer className="d-flex justify-content-end align-items-center">
                                    <ModalDeleteAlm alamat={alamat} onClose={fetchAlamat} />
                                    <Button className="w-0" variant="primary" onClick={() => navigate(`/pembeli/editAlamat/${alamat.id_alamat}`)}> 
                                        Edit
                                    </Button>
                                    {alamatCheckout.id_alamat !== alamat.id_alamat && (
                                      <ModalSelectAlm alamat={alamat} />
                                    )}
                                </Card.Footer>
                                </Card>
                            </Col>
                            ))}
                        </Row>
                        ) : (
                        <Alert className="text-center" variant="warning">Data Alamat Tidak Ditemukan / Belum Ada :(</Alert>
                        )}
                    </>
                )}
            </Container>
        </>
    );
};

export default UbahAlamatPage;