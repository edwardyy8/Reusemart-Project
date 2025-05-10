import { Container, Tab, Tabs, Card, Spinner, Alert, Button, Row, Col, Form, Modal, ModalFooter } from "react-bootstrap";
import reusemart from "../../assets/images/titlereuse.png";
import { getProfileData, getPenitipanData, perpanjangRincianPenitipan, ambilTitipan } from "../../api/apiPenitip";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import InputFloatingForm from "../../components/forms/InputFloatingForm";
import { GetPenjualanByIdPenitip } from "../../api/apiPenjualan";
import { donasiByPenitip } from "../../api/apiBarang";
import { toast } from "react-toastify";


const ProfilePenitipPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState('profil');
  const [profileData, setProfileData] = useState(null);
  const [penjualanData, setPenjualanData] = useState([]);
  const [titipanData, setTitipanData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showPerpanjangan, setShowPerpanjangan] = useState(false);
  const [penitipanHabis, setPenitipanHabis] = useState(false);
  const [showPengambilan, setShowPengambilan] = useState(false);
  const [selectedPenitipan, setSelectedPenitipan] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
      const penjualan = await GetPenjualanByIdPenitip(profile.id_penitip);
      if (!penjualan) {
        return (
          <Container className="mt-5 text-center">
            <Alert variant="warning">Data tidak ditemukan</Alert>
          </Container>
        );
      }
      setPenjualanData(penjualan);

      const titipan = await getPenitipanData(profile.id_penitip);
      if (!titipan) {
        return (
          <Container className="mt-5 text-center">
            <Alert variant="warning">Data tidak ditemukan</Alert>
          </Container>
        );
      }
      setTitipanData(titipan);

    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handlePerpanjang = async () => {
    try {
      const newTanggalAkhir = new Date(selectedPenitipan.tanggal_akhir);
      newTanggalAkhir.setDate(newTanggalAkhir.getDate() + 30);
      
      const response = await perpanjangRincianPenitipan(selectedPenitipan.id_rincianpenitipan, newTanggalAkhir.toISOString());
      console.log(selectedPenitipan);
      setTitipanData(titipanData.map(titipan => 
        titipan.id_penitipan === selectedPenitipan.id_penitipan
          ? { 
              ...titipan, 
              perpanjangan: "Ya",
              tanggal_akhir: response.tanggal_akhir
            } 
          : titipan
      ));
      
      setShowPerpanjangan(false);
      toast.success("Berhasil memperpanjang masa penitipan");
    } catch (error) {
      toast.error("Gagal memperpanjang masa penitipan");
    }
  };

  const handleAmbil = async () => {
    try {
      const response = await ambilTitipan(selectedPenitipan.id_rincianpenitipan);
      setTitipanData(titipanData.map(titipan => 
      titipan.id_rincianpenitipan === selectedPenitipan.id_rincianpenitipan
        ? { 
            ...titipan, 
            status_penitipan: "Diambil Kembali",
            batas_akhir: response.batas_akhir
          } 
        : titipan
      ));
      toast.success("Pengambilan titipan berhasil dijadwalkan");
      setPenitipanHabis(false);
      setShowPengambilan(true);
    } catch (error) {
      toast.error("Gagal mengambil titipan");
    }
  };

  const handleDonasi = async () => {
    try {
      await donasiByPenitip(selectedPenitipan.id_barang);
      setTitipanData(titipanData.map(titipan => 
      titipan.id_rincianpenitipan === selectedPenitipan.id_rincianpenitipan
        ? { 
            ...titipan, 
            status_penitipan: "Didonasikan",
            status_barang: "Didonasikan"
          } 
        : titipan
      ));
      toast.success("Terima kasih telah mendonasikan barang anda");
      setPenitipanHabis(false);
    } catch (error) {
      toast.error("Gagal mendonasikan barang");
    }
  };

  const renderAdditionalButton = (titipan) => {
    const hariIni = new Date();
    const tanggalAkhir = new Date(titipan.tanggal_akhir);
    const sisaHari = Math.ceil((tanggalAkhir - hariIni) / (1000 * 60 * 60 * 24));
    const sudahLewat = hariIni > tanggalAkhir;
    const tersedia = titipan.barang.status_barang === "Tersedia";
    const terproses = ["Terjual", "Didonasikan"].includes(titipan.barang.status_barang);
    const sudahPerpanjang = titipan.perpanjangan === "Ya";
    const diambil = titipan.status_penitipan === "Diambil Kembali";

    if (terproses) return null;

    if (diambil){
      return (
        <Button 
          className="btnHijau w-50"
          onClick={() => {
            setSelectedPenitipan(titipan);
            setShowPengambilan(true);
          }}
        >
          Informasi Pengambilan
        </Button>
      );
    }
    
    if (!sudahPerpanjang && !sudahLewat && tersedia) {
      return (
        <Button 
          variant="danger" 
          className="w-50"
          onClick={() => {
            setSelectedPenitipan(titipan);
            setShowPerpanjangan(true);
          }}
        >
          Perpanjang ({sisaHari} hari tersisa)
        </Button>
      );
    }
    
    if ((!sudahPerpanjang && sudahLewat && tersedia) || 
        (sudahPerpanjang && sudahLewat && tersedia)) {
      return (
        <Button 
          className="btnHijau w-50"
          onClick={() => {
            setSelectedPenitipan(titipan);
            setPenitipanHabis(true);
          }}
        >
          Ambil/Donasi
        </Button>
      );
    }
    
    if (sudahPerpanjang && !sudahLewat && tersedia) {
      return (
        <Button 
          variant="danger" 
          className="w-50"
          disabled
        >
          Perpanjang ({sisaHari} hari tersisa)
        </Button>
      );
    }
  
    return null;
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
              className="rounded-circle" style={{border: "1px black solid"}} alt="Profile penitips" height="100" />
      </div>

      <h3 className="text-center text-muted">@{profileData?.nama}</h3>

      <Container className="d-flex flex-column justify-content-center align-items-center gap-2 mt-3">
        <div className="text-center mt-0 mb-3 p-1 rounded-3 w-50 border-dark border">
          <h5 className="mt-1">{profileData?.poin_penitip.toLocaleString("id-ID") ?? 0}</h5>
          <p className="text-muted mb-1">Poin Reward</p>
        </div>
        <div className="text-center mt-0 mb-3 p-1 rounded-3 w-50 border-dark border">
          <h5 className="mt-1">{profileData.saldo_penitip.toLocaleString("id-ID") ?? 0}</h5>
          <p className="text-muted mb-1">Saldo Penitip</p>
        </div>  
      </Container>
      
      <Tabs activeKey={activeKey} onSelect={(k) => setActiveKey(k)} className="mb-4 justify-content-center custom-tabs" fill>
        <Tab eventKey="penjualan" title="Penjualan Saya">
          {penjualanData.length > 0 ? (
            <Row className="g-3">
              {penjualanData.map((item, idx) => (
                <Col md={12} sm={12} xs={12} lg={12} key={idx} className="mb-3 px-5 d-flex justify-content-center">
                <Card className="h-100 w-100">
                  <Card.Body>
                    <Card.Title className="border-bottom">
                      <h5>ID Order : {item.id_pemesanan}</h5>
                      <p className="text-muted h6">Tanggal Order : {formatTanpaDetik(item.pemesanan.tanggal_pemesanan)}</p>
                    </Card.Title>
                    <Card.Text>
                      <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="">
                          <h5 className="fw-bold mb-0">{item.barang.nama_barang}</h5>
                          </div>
                          <div>
                            <img src={`http://127.0.0.1:8000/storage/foto_barang/${item.rincian_pemesanan?.[0].barang?.[0].foto_barang}`} 
                                  alt="Foto Barang" 
                                  height={100}
                                  className="rounded-2"/>
                          </div> 
                        </div>
                        <div className="text-muted">
                          Status Order : {item.pemesanan.status_pengiriman}
                        </div>
                      </div>
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="">
                      <Button className="w-100" variant="outline-secondary" onClick={() => navigate(`/penitip/detailPenjualan/${item.id_rincianpemesanan}`)}> 
                          Lihat Detail
                      </Button>
                  </Card.Footer>
                </Card>
              </Col>
              ))}
            </Row>
          ) : (
            <Alert className="text-center" variant="warning">Belum Ada Penjualan :(</Alert>
          )}
        </Tab>

        <Tab eventKey="profil" title="Profil Saya">
          <Container className="mt-5 mb-4 p-5 rounded-3 w-50" style={{ border: '1px solid rgb(122, 122, 122)', backgroundColor: 'rgb(255, 255, 255)' }}>
            <h4>Nama Penitip</h4>
            <InputFloatingForm
              value={profileData?.nama}
              disabled
            />
            <h4>Role</h4>
            <InputFloatingForm
              value="Penitip"
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
                Ubah password? <Link to="/lupaPassword">Klik Disini!</Link>
            </h6>
            <h6 className="text-muted">Karena kebijakan privasi kami, peran Anda tidak mengizinkan perubahan profil secara mandiri. Silakan kunjungi kantor kami jika ingin memperbarui data pribadi.</h6>
          </Container>
        </Tab>

        <Tab eventKey="barang" title="Barang Saya">
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
            {titipanData.length > 0 ? (
              <div>
                {titipanData.filter((titipan) => searchTerm==="" || titipan.barang.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((titipan, idx) => {
                    const terproses = ["Terjual", "Didonasikan"].includes(titipan.barang.status_barang);
                    return (
                      <Row className="g-3" key={idx}>
                        <Col md={12} sm={12} xs={12} lg={12} className="mb-3 px-5 d-flex justify-content-center">
                          <Card className="h-100 w-100">
                            <Card.Body>
                              <Card.Title className="border-bottom">
                                <h5>ID Titipan : {titipan.id_penitipan}</h5>
                                <p className="text-muted h6">Tanggal Titip : {formatTanpaDetik(titipan.barang.tanggal_masuk)}</p>
                              </Card.Title>
                              <Card.Text>
                                <div className="d-flex flex-column">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <h5 className="fw-bold mb-0">{titipan.barang.nama_barang}</h5>
                                    </div>
                                    <div>
                                      <img
                                        src={`http://127.0.0.1:8000/storage/foto_barang/${titipan.barang.foto_barang}`}
                                        alt="Foto Barang"
                                        height={100}
                                        className="rounded-2"
                                      />
                                    </div>
                                  </div>
                                  <div className="text-muted">
                                    Status Barang : {titipan.barang.status_barang}
                                  </div>
                                </div>
                              </Card.Text>
                            </Card.Body>
                            <Card.Footer className="d-flex gap-2">
                              <Button
                                className={terproses ? "w-100" : "w-50"}
                                variant="outline-secondary"
                                onClick={() => {
                                  setSelectedPenitipan(titipan);
                                  setShowDetail(true);
                                }}
                              >
                                Lihat Detail
                              </Button>
                              {renderAdditionalButton(titipan)}
                            </Card.Footer>
                          </Card>
                        </Col>
                      </Row>
                    );
                  })}
              </div>
            ) : (
              <Alert className="text-center" variant="warning">
                Belum Ada Titipan :(
              </Alert>
            )}
        </Tab>
      </Tabs>

      <Modal show={showDetail} onHide={() => setShowDetail(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detail Barang</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPenitipan && (
            <>
            <Row>
              <Col md={8} className="gap-4">
                <h3><b>{selectedPenitipan.barang.nama_barang}</b></h3>
                <div className="d-flex flex-column gap-1">
                  <span>Status: <span className="text-muted">{selectedPenitipan.barang.status_barang}</span></span>
                  <span>Harga: <span className="text-muted">{selectedPenitipan.barang.harga_barang}</span></span>
                  <span>Garansi: <span className="text-muted">{selectedPenitipan.barang.garansi}</span></span>
                  <span>Tanggal Masuk: <span className="text-muted">{formatTanpaDetik(selectedPenitipan.barang.tanggal_masuk)}</span></span>
                  <span>Tanggal Berakhir: <span className="text-muted">{formatTanpaDetik(selectedPenitipan.tanggal_akhir)}</span></span>
                  <span>Perpanjangan: <span className="text-muted">{selectedPenitipan.perpanjangan}</span></span>
                  <span>Deskripsi: </span>
                  <InputFloatingForm
                    as="textarea"
                    className="text-muted"
                    placeholder={selectedPenitipan.barang.deskripsi}
                    disabled
                  />
                </div>
              </Col>
              <Col ms={6} className="d-flex flex-column align-items-end mt-5">
                <img 
                  src={`http://127.0.0.1:8000/storage/foto_barang/${selectedPenitipan.barang.foto_barang}`}
                  alt="Foto barang" 
                  style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }} 
                />
              </Col>
            </Row>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showPerpanjangan} onHide={() => setShowPerpanjangan(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Perpanjangan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah anda yakin ingin memperpanjang masa penitipan (30 hari)?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPerpanjangan(false)}>
            Batal
          </Button>
          <Button variant="success" onClick={handlePerpanjang}>
            Perpanjang
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={penitipanHabis} onHide={() => setPenitipanHabis(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Ambil/Donasi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPenitipan && (
            <>
            <Row>
              <Col md={8} className="gap-4">
                <h3><b>{selectedPenitipan.barang.nama_barang}</b></h3>
                <div className="d-flex flex-column gap-1">
                  <span>Status: <span className="text-muted">{selectedPenitipan.barang.status_barang}</span></span>
                  <span>Harga: <span className="text-muted">{selectedPenitipan.barang.harga_barang}</span></span>
                  <span>Garansi: <span className="text-muted">{selectedPenitipan.barang.garansi}</span></span>
                  <span>Tanggal Masuk: <span className="text-muted">{formatTanpaDetik(selectedPenitipan.barang.tanggal_masuk)}</span></span>
                  <span>Tanggal Berakhir: <span className="text-muted">{formatTanpaDetik(selectedPenitipan.tanggal_akhir)}</span></span>
                  <span>Perpanjangan: <span className="text-muted">{selectedPenitipan.perpanjangan}</span></span>
                  <span>Deskripsi: </span>
                  <InputFloatingForm
                    as="textarea"
                    className="text-muted"
                    placeholder={selectedPenitipan.barang.deskripsi}
                    disabled
                  />
                </div>
              </Col>
              <Col ms={6} className="d-flex flex-column align-items-end mt-5">
                <img 
                  src={`http://127.0.0.1:8000/storage/foto_barang/${selectedPenitipan.barang.foto_barang}`}
                  alt="Foto barang" 
                  style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }} 
                />
              </Col>
            </Row>
            
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex flex-column gap-2">
          <Row className="w-100">
            <p className="text-danger mb-0 text-start">
              ⚠️ Peringatan! Aksi ini tidak bisa dibatalkan.
            </p>
          </Row>
          <Row className="w-100">
            <Col xs={6} className="pe-1">
              <Button className="btnHijau w-100" onClick={handleAmbil}>
                Ambil
              </Button>
            </Col>
            <Col xs={6} className="ps-1">
              <Button variant="warning" className="w-100" onClick={handleDonasi}>
                Donasi
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>

      <Modal show={showPengambilan} onHide={() => setShowPengambilan(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ambil Titipan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPenitipan && (
            <>
            <div className="d-flex flex-column gap-1">
              <h5><strong>Alamat Pengambilan</strong></h5>
              Gudang ReuseMart <br />
              +628987654321 <br />
              Jl. Babarsari no. 111 (ruko 7 lantai di depan pom bensin, pagar besi), Depok, Sleman, Yogyakarta <br />
            </div>
            <p className="text-danger mb-0 text-start">
                ⚠️ Batas Pengambilan: {formatTanpaDetik(selectedPenitipan.batas_akhir)}
            </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPengambilan(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Outlet/>
    </Container>
  );
};

export default ProfilePenitipPage;