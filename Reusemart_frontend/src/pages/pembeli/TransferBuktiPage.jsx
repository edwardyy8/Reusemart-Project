import { Container, Card, Spinner, Alert, Button, Modal, Form, Col, Row } from "react-bootstrap";
import { BsCaretRightFill } from "react-icons/bs";
import { GetPemesananByIdPemesanan, KirimBuktiPembayaran } from "../../api/apiPemesanan";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCopy } from "react-icons/fa";

import FlipCountdown from "../../components/countdown/FlipDigit";
import { FetchMenungguPembayaran } from "../../api/apiPemesanan";

const TransferBuktiPage = () => {
    const { id } = useParams();
    const [pembelianData, setPembelianData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const [bukti, setBukti] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const rekening = '12345656321';

    const [data, setData] = useState({
        foto_bukti: null,
    });
    
    const [batasWaktu, setBatasWaktu] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setBukti(file);
        setData({ ...data, foto_bukti: file });
        setIsDisabled(false);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(rekening);
        toast.success('Nomor rekening berhasil disalin!');
    };


    const fetchPembelianData = async () => {
        try {
            setLoading(true);

            const batal = await FetchMenungguPembayaran();
            
            const pembelian = await GetPemesananByIdPemesanan(id);
            if (!pembelian) {
                return (
                    <Container className="mt-5 text-center">
                    <Alert variant="warning">Data Pembelian tidak ditemukan</Alert>
                    </Container>
                );
            } 

            if(pembelian.data.status_pembayaran != "Menunggu Pembayaran"){
                navigate("/pembeli/profile");
                toast.warning("Pembayaran sudah dilakukan, tidak ada halaman ini");
                return;
            }

            const data = pembelian.data;
            setPembelianData(data);
            console.log("API Response:", data);
            setBatasWaktu(new Date(new Date(pembelian.data.tanggal_pemesanan).getTime() + 1 * 60 * 1000));
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.message || err.message || "Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPembelianData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        setIsDisabled(true);

        try {
            const response = await KirimBuktiPembayaran(data ,id);
            
            toast.success("Bukti pembayaran berhasil dikirim");
            navigate("/pembeli/profile?tab=pembelian");
        } catch (err) {
            console.log(err);
            toast.error("Gagal mengirim bukti pembayaran: " + (err.message || "Terjadi kesalahan"));
        } finally {
            setLoading(false);
            setIsDisabled(false);
        }
    }



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
                    <h6 className="ms-1 mb-0">Pembelian saya</h6>
                    <BsCaretRightFill className="ms-1 text-muted" size={12}  />
                    <h6 className="ms-1 mb-0">Kirim Bukti transfer</h6>
                    <BsCaretRightFill className="ms-1 text-muted" size={12} />
                </div>
            </Container>
            
            <Col lg={8} md={8} className="mt-5 ms-auto me-auto p-1">

                <Card className="mt-4 mb-4 shadow-sm h-100 w-100 rounded-3 mb-4"  >
               
                    <Card.Title className="modal-header p-3 rounded-top-3 fw-bold">Kirim Bukti Transfer</Card.Title>
                    
                    <Card.Body>
                        <Row className="d-flex justify-content-between mb-2">
                            <Col lg={7} md={7} className="d-flex flex-column">
                                <h6>
                                    Silakan transfer ke rekening berikut dan upload bukti transfer:
                                </h6>
                                <h4>Bank <strong>BCA</strong> a/n <strong>CV ReuseMart</strong></h4>
                                <div className="d-flex align-items-center mb-3">
                                    <h3 className="hijau fw-bold mb-0">{rekening}</h3>
                                    <Button className="mb-2" variant="light" onClick={handleCopy}><FaCopy /></Button>
                                </div>
                                <hr />
                                <h5>
                                    Nomor pemesanan : {pembelianData.id_pemesanan}
                                    <br />
                                    Tanggal pemesanan : {formatTanpaDetik(pembelianData.tanggal_pemesanan)}
                                </h5>
                                <hr />
                                <div className="mb-2 text-danger fw-bold h5">
                                    Sisa waktu pembayaran:
                                </div>

                                {pembelianData.status_pembayaran == "Menunggu Pembayaran" && (
                                    <FlipCountdown targetTime={batasWaktu} idPemesanan={pembelianData.id_pemesanan}/>
                                )}
                            </Col>

                            <Col lg={4} md={4} className="d-flex justify-content-center">
                                <Form className="" encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)}>
                                    <Form.Group controlId="formBuktiTransfer" className="">
                                        <Form.Label className="h4 fw-bold pt-0">Upload Bukti Transfer</Form.Label>
                                        <Form.Control 
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                        />
                                    </Form.Group>
                                    {previewUrl && (
                                        <div className="mt-3">
                                            <p>Preview:</p>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <img src={previewUrl} alt="Preview Bukti" className="img-fluid rounded-2" style={{ maxHeight: '150px', maxWidth: '150px' }} />
                                            </div>
                                        </div>
                                    )}
                                    <Button className="btnHijau mt-3 w-100" disabled={isDisabled} onClick={() => setShowModal(true)}>
                                        Kirim
                                    </Button>
                                </Form>
                            </Col>

                        </Row>

                    
                    </Card.Body>
                </Card>
            </Col>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Konfirmasi Kirim Bukti Transfer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Apakah Anda yakin ingin mengirim bukti transfer ini?
                    {previewUrl && (
                        <div className="mt-3">
                            <p>Preview:</p>
                            <div className="d-flex align-items-center justify-content-center">
                                <img src={previewUrl} alt="Preview Bukti" className="img-fluid rounded-2" style={{ maxHeight: '150px', maxWidth: '150px' }} />
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btnHijau" onClick={(e) => handleSubmit(e)}>
                        Kirim
                    </Button>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Batal
                    </Button>
                </Modal.Footer>
            </Modal>
            
        </>
    );
};

export default TransferBuktiPage;