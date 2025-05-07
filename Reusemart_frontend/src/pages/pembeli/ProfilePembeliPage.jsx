import { Container, Tab, Tabs, Card, Spinner, Alert, Row, Col, Button, Badge, Form } from "react-bootstrap";
import reusemart from "../../assets/images/titlereuse.png";
import { getProfileData } from "../../api/apiPembeli";
import { GetPemesananByIdPembeli } from "../../api/apiPemesanan";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import InputFloatingForm from "../../components/forms/InputFloatingForm";
import { GetAlamatByIdPembeli } from "../../api/apiAlamat";

import { toast } from "react-toastify";
import ModalDeleteAlm from "../../components/modals/alamat/ModalDeleteAlm";
import { FaSearch } from "react-icons/fa";


const ProfilePembeliPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeKey, setActiveKey] = useState('profil');

    const [profileData, setProfileData] = useState(null);
    const [pembelianData, setPembelianData] = useState([]);
    const [alamatData, setAlamatData] = useState([]);
    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAlm, setLoadingAlm] = useState(true);

    const [searchAlamat, setSearchAlamat] = useState("");
    const [filteredAlamat, setFilteredAlamat] = useState([]);

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

        const pembelian = await GetPemesananByIdPembeli(profile.id_pembeli);
        if (!pembelian) {
          return (
            <Container className="mt-5 text-center">
              <Alert variant="warning">Data pembelian tidak ditemukan</Alert>
            </Container>
          );
        }
        setPembelianData(pembelian.data);
        
      } catch (err) {
        console.log(err);
        setError(err?.response?.data?.message || err.message || "Gagal memuat data");
      } finally {
        setLoading(false);
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
        setAlamatData(alamat.data);
      } catch (err) {
        console.log(err);
        setError(err?.response?.data?.message || err.message || "Gagal memuat data");
      } finally {
        setLoadingAlm(false);
      }
    };

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        setActiveKey(tabParam);
      }
    }, [location.search]);

    useEffect(() => {
      fetchProfile();
    }, []);

    useEffect(() => {
      if(!profileData) return;

      fetchAlamat();
    }, [profileData]);

    const formatTanpaDetik = (tanggal) => {
        const date = new Date(tanggal);
        const tahun = date.getFullYear();
        const bulan = String(date.getMonth() + 1).padStart(2, '0');
        const hari = String(date.getDate()).padStart(2, '0');
        const jam = String(date.getHours()).padStart(2, '0');
        const menit = String(date.getMinutes()).padStart(2, '0');
      
        return `${tahun}-${bulan}-${hari} ${jam}:${menit}`;
    };
    
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

    if (loading) { 
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
        <Container className="mt-5">
          <div className="text-center mb-4 d-flex flex-row justify-content-center align-items-center gap-3">
            <img src={`http://127.0.0.1:8000/storage/foto_profile/${profileData?.foto_profile}`} 
                 className="rounded-circle" style={{border: "1px black solid"}} alt="Profile pembeli" height="100" />
          </div>
    
          <h3 className="text-center text-muted">@{profileData?.nama}</h3>
      
          <Container className="text-center mt-0 mb-3 p-1 rounded-3 w-50 border border-dark">
            <h5 className="mt-1">{profileData?.poin_pembeli.toLocaleString("id-ID")?? 0}</h5>
            <p className="text-muted mb-1">Poin Reward</p>
          </Container>
    
          <Tabs activeKey={activeKey} onSelect={(k) => setActiveKey(k)} className="mb-4 justify-content-center custom-tabs" fill>
          <Tab eventKey="pembelian" title="Pembelian Saya" >
              {pembelianData.length > 0 ? (
                <Row className="g-3">
                  {pembelianData.map((item, idx) => (
                    <Col md={12} sm={12} xs={12} lg={12} key={idx} className="mb-3 px-5 d-flex justify-content-center">
                      <Card className="h-100 w-100">
                        <Card.Body>
                          <Card.Title className="border-bottom">
                            ID Order : {item.id_pemesanan}
                            <br />
                            <p className="text-muted h6">Tanggal Order : {formatTanpaDetik(item.tanggal_pemesanan)}</p>
                          </Card.Title>
                          <Card.Text>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="">
                                Jumlah Barang : {item.rincian_pemesanan.length}
                                <br />
                                Total Harga : Rp {item.total_harga.toLocaleString("id-ID")}
                                <br />
                                Status Order : {item.status_pengiriman}
                              </div>
                              <div>
                                <img src={`http://127.0.0.1:8000/storage/foto_barang/${item.rincian_pemesanan[0].barang.foto_barang[0].foto_barang}`} 
                                      alt="Foto Barang" 
                                      height={100}
                                      className="rounded-2"/>
                              </div>
                            </div>
                          </Card.Text>
                          
                        </Card.Body>
                        <Card.Footer className="">
                            <Button className="w-100" variant="outline-secondary" onClick={() => navigate(`/pembeli/detailPembelian/${item.id_pemesanan}`)}> 
                                Lihat Detail
                            </Button>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert className="text-center" variant="warning">Belum Ada Pembelian :(</Alert>
              )}
            </Tab>
    
            <Tab eventKey="profil" title="Profil Saya">
              <Container className="mt-5 mb-5 p-5 rounded-3 w-50" style={{ border: '1px solid rgb(122, 122, 122)', backgroundColor: 'rgb(255, 255, 255)' }}>
                <h4>Nama Pembeli</h4>
                <InputFloatingForm
                  value={profileData?.nama}
                  disabled
                />
                <h4>Role</h4>
                <InputFloatingForm
                  value="Pembeli"
                  disabled
                />
                <h4>Email</h4>
                <InputFloatingForm
                  value={profileData?.email}
                  disabled
                />
                <h4>Password</h4>
                <InputFloatingForm
                  type="password"
                  value={profileData?.password}
                  disabled
                />
                <h6 className="mt-2 mb-4 text-primary">
                    Ubah password? <Link to="/resetPassword">Klik Disini!</Link>
                </h6>
                <h6 className="text-muted">Karena kebijakan privasi kami, peran Anda tidak mengizinkan perubahan profil secara mandiri. Silakan kunjungi kantor kami jika ingin memperbarui data pribadi.</h6>
              </Container>
            </Tab>
    
            <Tab eventKey="alamat" title="Alamat Saya">
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
                      <Form className="d-flex my-2 my-lg-0 position-relative" style={{ minWidth: "300px" }} onSubmit={(e) => e.preventDefault()} >
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
                          placeholder="Cari nama alamat"
                          value={searchAlamat}
                          onChange={handleSearchAlamatChange}
                          className="ps-5"
                          aria-label="Search"
                          style={{
                            paddingLeft: '2.5rem',
                            borderColor: 'rgba(83, 83, 83, 1)',
                          }}
                        />
                      </Form>
                      <Button className="btnHijau ms-3" onClick={() => navigate("/pembeli/tambahAlamat")}>
                        Tambah Alamat
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
                                  {alamat.is_default ? ( 
                                      <Badge className="ms-2 p-2 defaultBadge"><p className="mb-0 h6">Default</p></Badge>
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
            </Tab>
          </Tabs>
        </Container>
    );
};

export default ProfilePembeliPage;