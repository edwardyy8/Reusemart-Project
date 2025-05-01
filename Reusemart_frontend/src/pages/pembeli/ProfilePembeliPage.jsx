import { Container, Tab, Tabs, Card, Spinner, Alert, Row, Col, Button } from "react-bootstrap";
import reusemart from "../../assets/images/titlereuse.png";
import { getProfileData } from "../../api/apiPembeli";
import { GetPemesananByIdPembeli } from "../../api/apiPemesanan";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputFloatingForm from "../../components/forms/InputFloatingForm";


const ProfilePembeliPage = () => {
    const [profileData, setProfileData] = useState(null);
    const [pembelianData, setPembelianData] = useState([]);
    
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
      
          <Container className="text-center mt-0 mb-3 p-1 rounded-3 w-50 border">
            <h5>{profileData?.poin_pembeli.toLocaleString("id-ID")?? 0}</h5>
            <p className="text-muted">Poin Reward</p>
          </Container>
    
          <Tabs defaultActiveKey="profil" className="mb-4 justify-content-center custom-tabs" fill>
          <Tab eventKey="pembelian" title="Pembelian Saya">
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
                            <Button className="w-100" variant="outline-secondary"> 
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
    
            <Tab eventKey="barang" title="Barang Saya">
              {/* {barangData.length > 0 ? (
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
              )} */}
            </Tab>
          </Tabs>
        </Container>
    );
};

export default ProfilePembeliPage;