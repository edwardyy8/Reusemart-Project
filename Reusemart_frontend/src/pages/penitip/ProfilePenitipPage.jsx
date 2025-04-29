import { Container, Tab, Tabs, Card, Spinner, Alert } from "react-bootstrap";
import reusemart from "../../assets/images/titlereuse.png";
import { getProfileData} from "../../api/apiPenitip";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputFloatingForm from "../../components/forms/InputFloatingForm";

const ProfilePenitipPage = () => {
  const [profileData, setProfileData] = useState(null);
  const [penjualanData, setPenjualanData] = useState([]);
  const [barangData, setBarangData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await getProfileData();
      // const penjualan = await getPenjualanSaya();
      // const barang = await getBarangSaya();
      setProfileData(profile);
      if (!profile) {
        return (
          <Container className="mt-5 text-center">
            <Alert variant="warning">Data tidak ditemukan</Alert>
          </Container>
        );
      }
      // setPenjualanData(penjualan);
      // setBarangData(barang);
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
        <img src={reusemart} alt="ReuseMart" height="50" />
        <h1 className="mt-1 hijau">P E N I T I P</h1>
      </div>

      <h3 className="text-center text-muted">@{profileData?.nama}</h3>

      <Container className="text-center mt-0 mb-3 p-0 rounded-3 w-50 border">
        <h5>{profileData?.poin_penitip ?? 0}</h5>
        <p className="text-muted">Poin Reward</p>
      </Container>

      <Tabs defaultActiveKey="profile" className="mb-4 justify-content-center custom-tabs" fill>
      <Tab eventKey="penjualan" title="Penjualan Saya">
          {penjualanData.length > 0 ? (
            <Row className="g-3">
              {penjualanData.map((item, idx) => (
                <Col md={4} key={idx}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{item.nama_produk}</Card.Title>
                      <Card.Text>
                        Jumlah Terjual: {item.jumlah_terjual}
                        <br />
                        Harga: Rp {item.harga}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert className="text-center" variant="warning">Belum Ada Penjualan :(</Alert>
          )}
        </Tab>

        <Tab eventKey="profil" title="Profil Saya">
          <Container className="mt-5 mb-0 p-5 rounded-3 w-50" style={{ border: '1px solid rgb(122, 122, 122)', backgroundColor: 'rgb(255, 255, 255)' }}>
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
