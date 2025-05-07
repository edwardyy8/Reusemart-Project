import { Container, Tab, Tabs, Card, Spinner, Alert, Button, Row, Col } from "react-bootstrap";
import reusemart from "../../assets/images/titlereuse.png";
import { getProfileData} from "../../api/apiPenitip";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import InputFloatingForm from "../../components/forms/InputFloatingForm";
import { GetPenjualanByIdPenitip } from "../../api/apiPenjualan";

const ProfilePenitipPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState('profil');

  const [profileData, setProfileData] = useState(null);
  const [penjualanData, setPenjualanData] = useState([]);
  const [barangData, setBarangData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await getProfileData();
      // const barang = await getBarangSaya();
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
      console.log(penjualan);
      
      // if (!barang) {
      //   return (
      //     <Container className="mt-5 text-center">
      //       <Alert variant="warning">Data tidak ditemukan</Alert>
      //     </Container>
      //   );
      // }
      // setBarangData(barang);
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
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
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="">
                          Nama Barang : {item.barang.nama_barang}
                          <br />
                          Status Order : {item.pemesanan.status_pengiriman}
                        </div>
                        <div>
                          <img src={`http://127.0.0.1:8000/storage/foto_barang/${item.rincian_pemesanan?.[0].barang?.[0].foto_barang}`} 
                                alt="Foto Barang" 
                                height={100}
                                className="rounded-2"/>
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
                Ubah password? <Link to="/resetPassword">Klik Disini!</Link>
            </h6>
            <h6 className="text-muted">Karena kebijakan privasi kami, peran Anda tidak mengizinkan perubahan profil secara mandiri. Silakan kunjungi kantor kami jika ingin memperbarui data pribadi.</h6>
          </Container>
        </Tab>

        <Tab eventKey="barang" title="Barang Saya">
          {barangData.length > 0 ? (
            <Row className="g-3">
              {barangData.map((barang, idx) => (
                <Col md={4} key={idx}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Text>
                        ID Titipan: {barang.id_penitipan}
                        <br />
                        Tanggal Titip: {barang.tanggal_masuk}
                      </Card.Text>
                      <Card.Text>
                        {barang.nama_barang}
                        <br />
                        Status barang: {barang.status_barang}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert className="text-center" variant="warning">Belum Ada Titipan :(</Alert>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ProfilePenitipPage;
