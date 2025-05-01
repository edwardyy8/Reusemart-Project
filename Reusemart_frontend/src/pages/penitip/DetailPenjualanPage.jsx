import { Container, Card, Spinner, Alert, Row, Col, Button } from "react-bootstrap";
import { BsCaretRightFill } from "react-icons/bs";
import { GetPenjualanById } from "../../api/apiPenjualan";
import { GetPemesananById } from "../../api/apiPemesanan";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";


const DetailPenjualanPage = () => {
    const { id } = useParams();
    const [penjualanData, setPenjualanData] = useState(null);
    const [rincianData, setRincianData] = useState(null);
    const [totalPendapatan, setTotalPendapatan] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPenjualanData = async () => {
        try {
            setLoading(true);
            
            const rincian = await GetPenjualanById(id);
            if (!rincian) {
                return (
                    <Container className="mt-5 text-center">
                    <Alert variant="warning">Data penjulaan tidak ditemukan</Alert>
                    </Container>
                );
            }
            setRincianData(rincian.data);
            
            const penjualan = await GetPemesananById(rincian.data.id_pemesanan);
            if (!penjualan) {
                return (
                    <Container className="mt-5 text-center">
                    <Alert variant="warning">Data penjulaan tidak ditemukan</Alert>
                    </Container>
                );
            }
            setPenjualanData(penjualan.data);

            setTotalPendapatan(rincian.data.harga_barang + rincian.data.bonus_penitip - rincian.data.komisi_reusemart - rincian.data.komisi_hunter);
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.message || err.message || "Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPenjualanData();
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
        <>
            <Container fluid className="py-3 shadow-sm my-3 abu83 px-5" style={{ backgroundColor: "rgba(252, 251, 249, 1)" }}>
                <div className="d-flex align-items-center">
                    <h5 className="mb-0">PROFIL</h5>
                    <BsCaretRightFill className="ms-2" />
                    <h6 className="ms-1 mb-0">Penjualan saya</h6>
                    <BsCaretRightFill className="ms-1 text-muted" size={12}  />
                    <h6 className="ms-1 mb-0">Lihat Detail</h6>
                    <BsCaretRightFill className="ms-1 text-muted" size={12} />
                </div>
            </Container>
            <Container className="d-flex flex-column mt-4 mb-5 justify-content-center align-items-center ">
                <Container className="text-start hijau">
                   <h3>Detail Penjualan</h3>
                </Container>
                <Container className="mt-3">
                    <Card>
                        <Card.Body>
                            <Card.Text className="mb-3 d-flex gap-3">
                                <img src={`http://127.0.0.1:8000/storage/foto_barang/${rincianData.barang.foto_barang[0].foto_barang}`} 
                                      alt="Foto Barang" 
                                      height={100}
                                      className="rounded-2"/>
                                <div className="flex-column">
                                    <h2>{rincianData.barang.nama_barang}</h2>
                                    <h5 className="text-muted">Rp {rincianData.barang.harga_barang.toLocaleString('id-ID')}</h5>
                                </div>
                            </Card.Text>
                            <div className="border-bottom border-dark mb-3"></div>
                            <Card.Title className="mb-3">
                                ID Rincian Order : {rincianData.id_rincianpemesanan}
                                <br />
                                <p className="text-muted h6 mb-0">ID Order : {rincianData.id_pemesanan}</p>
                                <p className="text-muted h6">Metode Pengiriman : {penjualanData.metode_pengiriman}</p>
                            </Card.Title>
                            <Card.Title className="mb-0">
                                Alamat Pengiriman
                            </Card.Title>
                            <Card.Text className="text-muted mb-3">
                                {penjualanData.alamat.nama_penerima} <br />
                                {penjualanData.alamat.no_hp} <br />
                                {penjualanData.alamat.nama_alamat} <br />
                            </Card.Text>
                            <div className="d-flex justify-content-between">
                                <Card.Title>Tanggal Order</Card.Title>
                                <Card.Title className="text-muted">{formatTanpaDetik(penjualanData.tanggal_pemesanan)}</Card.Title>
                            </div>
                            {penjualanData.metode_pengiriman === "kurir" ? (
                                <div className="d-flex justify-content-between">
                                    <Card.Title>Tanggal Pengiriman</Card.Title>
                                    <Card.Title className="text-muted">{formatTanpaDetik(penjualanData.tanggal_pengiriman)}</Card.Title>
                                </div>
                                ) : (
                                <div className="d-flex justify-content-between">
                                    <Card.Title>Tanggal Pengambilan</Card.Title>
                                    <Card.Title className="text-muted">{formatTanpaDetik(penjualanData.jadwal_pengambilan)}</Card.Title>
                                </div>
                            )}
                            <div className="d-flex justify-content-between">
                                <Card.Title>Status {penjualanData.metode_pengiriman === "kurir" ? 'Pengiriman' : 'Pengambilan' }</Card.Title>
                                <Card.Title className="text-muted">{penjualanData.status_pengiriman}</Card.Title>
                            </div>
                            
                        </Card.Body>
                    </Card>
                </Container>
                <Container className="text-start hijau mt-4">
                   <h3>Pendapatan</h3>
                </Container>
                <Container className="mt-3">
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <Card.Text className="h5 text-muted">Bonus Terjual Cepat</Card.Text>
                                <Card.Text className="h5 text-success">+Rp{rincianData.bonus_penitip.toLocaleString('id-ID')}</Card.Text>
                            </div>
                            <div className="d-flex justify-content-between">
                                <Card.Text className="h5 text-muted">Komisi Hunter</Card.Text>
                                <Card.Text className="h5 text-danger">-Rp{rincianData.komisi_hunter.toLocaleString('id-ID')}</Card.Text>
                            </div>
                            <div className="d-flex justify-content-between">
                                <Card.Text className="h5 text-muted">Komisi ReuseMart</Card.Text>
                                <Card.Text className="h5 text-danger">-Rp{rincianData.komisi_reusemart.toLocaleString('id-ID')}</Card.Text>
                            </div>
                            <div className="d-flex justify-content-between">
                                <Card.Text className="h4">Total Pendapatan</Card.Text>
                                <Card.Text className="h4">Rp{totalPendapatan.toLocaleString('id-ID')}</Card.Text>
                            </div>
                                                     
                        </Card.Body>
                    </Card>
                </Container>
                <Container className="d-flex justify-content-end mt-4 mb-1">
                    <Button className="rounded-pill" variant="light" onClick={() => navigate(-1)}>
                        Kembali
                    </Button>
                </Container>
            </Container>
            
        </>
    );
}

export default DetailPenjualanPage;