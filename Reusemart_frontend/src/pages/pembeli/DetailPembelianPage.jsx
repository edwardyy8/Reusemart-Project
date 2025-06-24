import { Container, Card, Spinner, Alert, Row, Col, Button, Badge, Modal, Form } from "react-bootstrap";
import { BsCaretRightFill } from "react-icons/bs";
import { GetPemesananByIdPemesanan, AddRating } from "../../api/apiPemesanan";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const DetailPembelianPage = () => {
    const { id } = useParams();
    const [pembelianData, setPembelianData] = useState(null);
    const [diskonPoin, setDiskonPoin] = useState(0);
    const [totalPembayaran, setTotalPembayaran] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();

    const cleanRupiah = (value) => {
        if (typeof value === 'string') {
            return parseFloat(value.replace(/[^0-9]/g, ''));
        }
        return Number(value); 
    };

    const fetchPembelianData = async () => {
        try {
            setLoading(true);
            const pembelian = await GetPemesananByIdPemesanan(id);
            if (!pembelian) {
                return (
                    <Container className="mt-5 text-center">
                        <Alert variant="warning">Data Pembelian tidak ditemukan</Alert>
                    </Container>
                );
            }
            const data = pembelian.data;
            setPembelianData(data);

            const diskon = (data.poin_digunakan / 100) * 10000;
            setDiskonPoin(diskon);

            const totalHarga = data.rincian_pemesanan.reduce((sum, item) => {
                return sum + item.barang.harga_barang;
            }, 0);

            const total = cleanRupiah(totalHarga) + cleanRupiah(data.ongkos) - cleanRupiah(diskon);
            setTotalPembayaran(total);

            data.total_harga_sum = totalHarga;

            const totalItem = new Set(
                pembelian.data.rincian_pemesanan.map(item => item.id_barang)
            ).size;
            pembelian.data.total_item = totalItem;
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.message || err.message || "Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    const handleRateClick = (item) => {
        setSelectedItem(item);
        setRating(item.rating || 0);
        setShowModal(true);
    };

    const handleRatingSubmit = async () => {
        try {
            await AddRating(selectedItem.id_rincianpemesanan, rating);
            setPembelianData(prev => ({
                ...prev,
                rincian_pemesanan: prev.rincian_pemesanan.map(item =>
                    item.id_rincianpemesanan === selectedItem.id_rincianpemesanan
                        ? { ...item, rating }
                        : item
                )
            }));
            setShowModal(false);
            setSelectedItem(null);
            setRating(0);
        } catch (err) {
            setError(err?.response?.data?.message || "Gagal mengirim rating");
        }
    };

    const canRate = pembelianData?.status_pengiriman === "Selesai" && pembelianData?.status_pembayaran === "Lunas";

    useEffect(() => {
        fetchPembelianData();
    }, []);

    const formatTanpaDetik = (tanggal) => {
        if (!tanggal) return "";
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
                    <h6 className="ms-1 mb-0">Pembelian saya</h6>
                    <BsCaretRightFill className="ms-1 text-muted" size={12} />
                    <h6 className="ms-1 mb-0">Lihat Detail</h6>
                    <BsCaretRightFill className="ms-1 text-muted" size={12} />
                </div>
            </Container>
            <Container className="d-flex flex-column mt-4 mb-5 justify-content-center align-items-center">
                <Container className="text-start hijau">
                    <h3>Detail Pembelian</h3>
                </Container>
                <Container className="mt-3">
                    <Card>
                        <Card.Body>
                            <div className="d-flex justify-content-between">
                                <Card.Title className="mb-3">
                                    ID Order : {pembelianData.id_pemesanan}
                                    <br />
                                    <span className="text-muted h6">Metode Pengiriman : {pembelianData.metode_pengiriman}</span>
                                </Card.Title>
                                <Badge bg={pembelianData.status_pembayaran === "Menunggu Verifikasi" || pembelianData.status_pembayaran === "Menunggu Pembayaran" ? "warning" : pembelianData.status_pembayaran === "Lunas" ? "success" : "danger"} className="h-50">
                                    <span className="h6">{pembelianData.status_pembayaran}</span>
                                </Badge>
                            </div>
                            {pembelianData.metode_pengiriman === "kurir" ? (
                                <div className="d-flex flex-column">
                                    <Card.Title>Alamat Pengiriman</Card.Title>
                                    <Card.Text className="text-muted mb-3">
                                        {pembelianData.alamat.no_hp} <br />
                                        {pembelianData.alamat.nama_alamat} <br />
                                    </Card.Text>
                                    <div className="border-bottom border-dark mb-3"></div>
                                    <div className="d-flex justify-content-between">
                                        <Card.Title>Tanggal Pengiriman</Card.Title>
                                        <Card.Title className="text-muted">{formatTanpaDetik(pembelianData.tanggal_pengiriman)}</Card.Title>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex flex-column">
                                    <Card.Title>Alamat Penjemputan</Card.Title>
                                    <Card.Text className="text-muted mb-3">
                                        Gudang ReuseMart <br />
                                        +628987654321 <br />
                                        Jl. Babarsari no. 111 (ruko 7 lantai di depan pom bensin, pagar besi), Depok, Sleman, Yogyakarta <br />
                                    </Card.Text>
                                    <div className="border-bottom border-dark mb-3"></div>
                                    <div className="d-flex justify-content-between">
                                        <Card.Title>Batas Pengambilan</Card.Title>
                                        <Card.Title className="text-muted">{formatTanpaDetik(pembelianData.batas_pengambilan)}</Card.Title>
                                    </div>
                                </div>
                            )}
                            <div className="d-flex justify-content-between">
                                <Card.Title>Status {pembelianData.metode_pengiriman === "kurir" ? 'Pengiriman' : 'Pengambilan'}</Card.Title>
                                <Card.Title className="text-muted">{pembelianData.status_pengiriman}</Card.Title>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
                <Container className="text-start hijau mt-4">
                    <h3>Ringkasan Pembelian</h3>
                </Container>
                <Container className="mt-3">
                    <Card>
                        <Card.Body>
                            {pembelianData.rincian_pemesanan.map((rincian, idx) => (
                                <div key={rincian.id_rincianpemesanan} className="mb-3 d-flex gap-3 position-relative">
                                    <img
                                        src={`https://laraveledwardy.barioth.web.id/storage/foto_barang/${rincian.barang?.foto_barang}`}
                                        alt="Foto Barang"
                                        height={100}
                                        className="rounded-2"
                                    />
                                    <div className="flex-column">
                                        <h2>{rincian.barang.nama_barang}</h2>
                                        <h5 className="text-muted">Rp {rincian.barang.harga_barang.toLocaleString('id-ID')}</h5>
                                    </div>
                                    <div className="position-absolute top-0 end-0">
                                        {rincian.rating ? (
                                            <Badge bg="success">Sudah Di Rate</Badge>
                                        ) : canRate ? (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleRateClick(rincian)}
                                            >
                                                Rate
                                            </Button>
                                        ) : (
                                            <Badge></Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="border-bottom border-dark mb-3"></div>
                            <div className="d-flex justify-content-between">
                                <Card.Text className="h4">Subtotal ({pembelianData.total_item} item{pembelianData.total_item > 1 ? "s" : ""})</Card.Text>
                                <Card.Text className="h5 text-muted">Rp{pembelianData.total_harga.toLocaleString('id-ID')}</Card.Text>
                            </div>
                            <div className="d-flex justify-content-between">
                                <Card.Text className="h4">Biaya Pengiriman</Card.Text>
                                <Card.Text className="h5 text-muted">Rp{pembelianData.ongkos.toLocaleString('id-ID')}</Card.Text>
                            </div>
                            <div className="d-flex justify-content-between">
                                <Card.Text className="h4">Diskon Poin</Card.Text>
                                <Card.Text className="h5 text-muted">-Rp{diskonPoin.toLocaleString('id-ID')}</Card.Text>
                            </div>
                            <div className="border-bottom border-dark mb-3"></div>
                            <div className="d-flex justify-content-between">
                                <Card.Text className="h4 hijau">Total Pembayaran</Card.Text>
                                <Card.Text className="h4 fw-bold">Rp{totalPembayaran.toLocaleString('id-ID')}</Card.Text>
                            </div>
                            <div className="d-flex justify-content-between">
                                <Card.Text className="h5 text-muted">Poin didapatkan</Card.Text>
                                <Card.Text className="h5 text-success">+{pembelianData.poin_didapatkan.toLocaleString('id-ID')} poin</Card.Text>
                            </div>
                            <div className="d-flex justify-content-between">
                                <Card.Text className="h5 text-muted">Poin digunakan</Card.Text>
                                <Card.Text className="h5 text-danger">-{pembelianData.poin_digunakan.toLocaleString('id-ID')} poin</Card.Text>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
                <Container className="d-flex justify-content-end mt-4 mb-1">
                    <Button className="rounded-pill" variant="light" onClick={() => navigate("/pembeli/profile?tab=pembelian")}>
                        Kembali
                    </Button>
                </Container>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Rate Barang</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Pilih Rating (1-5 Bintang)</Form.Label>
                            <div className="d-flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        size={30}
                                        color={star <= rating ? "#ffc107" : "#e4e5e9"}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleRatingSubmit}
                        disabled={rating === 0}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DetailPembelianPage;