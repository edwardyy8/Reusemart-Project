import { useState, useEffect } from "react";
import { Container, Card, Spinner, Alert, Row, Col, Button, Form, Modal } from "react-bootstrap";
import { BsCaretRightFill } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useKeranjang } from "../../context/KeranjangContext";
import { HandleSelectKeranjang, DeleteKeranjang, DeleteKeranjangHabis } from "../../api/apiKeranjang";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

import { GetDefaultAlamat } from "../../api/apiAlamat";
import { getProfileData } from "../../api/apiPembeli";
import InputFloatingForm from "../../components/forms/InputFloatingForm";

import ModalPesananSukses from "../../components/modals/ModalPesananSukses";
import { TambahPemesanan } from "../../api/apiPemesanan";

const CheckoutPage = () => {
    const navigate = useNavigate();
    
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [alamatData, setAlamatData] = useState({});
    const [pembeliData, setPembeliData] = useState({});
    const selectedAlamat = location.state?.alamat || null;
    const [metode, setMetode] = useState('kurir');
    const [pakaiPoin, setPakaiPoin] = useState(0);
    const [maxPoin, setMaxPoin] = useState(0);
    const [diskonPoin, setDiskonPoin] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [idPemesanan, setIdPemesanan] = useState(null);
    const [showModalKonfirmasi, setShowModalKonfirmasi] = useState(false);
    const [isCheckout, setIsCheckout] = useState(false);

    const { 
        fetchKeranjang, totalHargaBarang, 
        itemKeranjangChecked
    } = useKeranjang();

    const [data, setData] = useState({
        metode_pengiriman: "kurir",
        id_pembeli: null,
        id_alamat: location.state?.alamat.id_alamat || 0,
        poin_digunakan: 0,
        poin_didapatkan: Math.floor(totalHargaBarang * 0.0001 + (totalHargaBarang >= 500000 ? (totalHargaBarang * 0.0001) * 0.2 : 0)),
        status_pembayaran: "Menunggu Pembayaran",
        ongkos: totalHargaBarang >= 1500000 ? 0 : 100000,
        keranjang: itemKeranjangChecked,
        total_harga: totalHargaBarang + (totalHargaBarang >= 1500000 ? 0 : 100000) - diskonPoin,
    });
    

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const profile = await getProfileData();
            
            setPembeliData(profile);
            setMaxPoin(profile.poin_pembeli);
            setData({
                ...data,
                id_pembeli: profile.id_pembeli,
            });
            
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
            setIsLoading(false);
        }
    };

    const fetchDefaultAlamat = async () => {
        setIsLoading(true);
        try {
            if(!selectedAlamat) {
                const response = await GetDefaultAlamat();
                setAlamatData(response.data);
                setData({
                    ...data,
                    id_alamat: response.data.id_alamat,
                });
                console.log("Alamat default:", response.data);
            }else {
                setAlamatData(selectedAlamat);
            }
        } catch (error) {
            console.error("Gagal mengambil alamat:", error);
        } finally {
            setIsLoading(false);
        }  
    }

    useEffect(() => {
        fetchKeranjang();
        fetchDefaultAlamat();
        fetchProfile();
    }, []);

    const handleCheckMetode = (option) => {
        setMetode(option == metode ? option : option);
        setData({
            ...data,
            metode_pengiriman: option,
            ongkos: option == 'kurir' ? totalHargaBarang >= 1500000 ? 0 : 100000 : 0,
        });
    };

    const handleChange = (event) => {
        const { name, value, type, files } = event.target;

        setData({
            ...data,
            [name]: type === "file" ? files[0] : value,
        });
    };

    const handlePoin = (e) => {
        let value = parseInt(e.target.value) || 0;
        if (value > maxPoin) value = maxPoin;
        if (value < 0) value = 0;
        setDiskonPoin(value*100);
        setPakaiPoin(value);
        setData({
            ...data,
            poin_didapatkan: Math.floor((totalHargaBarang - (value*100)) * 0.0001 + (totalHargaBarang >= 500000 ? (totalHargaBarang - (value*100)) * 0.0001 * 0.2 : 0)),
            poin_digunakan: value,
            total_harga: totalHargaBarang + data.ongkos - (value*100),
        });
    };

    const increment = () => {
        setPakaiPoin(prev => {
            const newPoin = prev < maxPoin ? prev + 1 : prev;
            setDiskonPoin(newPoin * 100);
            setData({
                ...data,
                poin_didapatkan: Math.floor((totalHargaBarang - (newPoin * 100)) * 0.0001 + (totalHargaBarang >= 500000 ? (totalHargaBarang - (newPoin * 100)) * 0.0001 * 0.2 : 0)),
                poin_digunakan: newPoin,
                total_harga: totalHargaBarang + data.ongkos - (newPoin * 100),
            });
            return newPoin;
        });
    };

    const decrement = () => {
        setPakaiPoin(prev => {
            const newPoin = prev > 0 ? prev - 1 : prev;
            setDiskonPoin(newPoin * 100);
            setData({
                ...data,
                poin_didapatkan: Math.floor((totalHargaBarang - (newPoin * 100)) * 0.0001 + (totalHargaBarang >= 500000 ? (totalHargaBarang - (newPoin * 100)) * 0.0001 * 0.2 : 0)),
                poin_digunakan: newPoin,
                total_harga: totalHargaBarang + data.ongkos - (newPoin * 100),
            });
            return newPoin;       
        });
    };

    if (error) {
        return (
            <Container className="mt-5 text-center">
                <Alert variant="danger">Error: {error}</Alert>
            </Container>
        );
    }

    const handleSubmitPemesanan = async (e) => {
        e.preventDefault();
        setShowModalKonfirmasi(false);
        setIsLoading(true);
    
        try {
            const finalData = {
                ...data,
                id_alamat: alamatData?.id_alamat, 
            };
            
            const response = await TambahPemesanan(finalData);
            setIdPemesanan(response.data.id_pemesanan);
            setIsCheckout(true);
            fetchKeranjang();
            setShowModal(true);
        } catch (error) {
            console.error("Error:", error);
            toast.error(error?.response?.data?.message || error.message || "Gagal membuat pesanan");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccess = () => {
        setShowModal(true);
    };

    const handleShowModalKonfirmasi = (e) => {
        e.preventDefault();
        setShowModalKonfirmasi(true);
    }

    if (!isLoading && itemKeranjangChecked.length === 0 && !isCheckout) {
        navigate('/pembeli/keranjang');
        toast.error("Tidak ada barang yang dipilih!"); 
        return;
    }


    return (
        <>
            <ModalPesananSukses
                show={showModal}
                handleClose={() => setShowModal(false)}
                noPemesanan={idPemesanan}
            />

            <Modal size="md" show={showModalKonfirmasi} onHide={() => setShowModalKonfirmasi(false)} centered>
                <Modal.Header className="boxHijau" closeButton>
                    <Modal.Title className="ms-3">Konfirmasi Pemesanan</Modal.Title>
                </Modal.Header>
                
                <Modal.Body >
                    <div className="p-3">
                       <h5>Apakah Anda yakin ingin melakukan pemesanan ini?</h5>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button 
                        className="btnHijau"
                        onClick={handleSubmitPemesanan}
                        disabled={isLoading}
                    >
                        <span>Ya</span>
                    </Button>

                    <Button variant="secondary" onClick={() => setShowModalKonfirmasi(false)}>
                        Batal
                    </Button>
                </Modal.Footer>
            </Modal>

            <Container fluid className="py-3 shadow-sm my-3 abu83 px-5" style={{ backgroundColor: "rgba(252, 251, 249, 1)" }}>
                <div className="d-flex align-items-center">
                    <h5 className="mb-0">CHECKOUT</h5>
                    <BsCaretRightFill className="ms-2" />
                </div>
            </Container>
            
            { isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
                    <Spinner as="span" animation="border" variant="success" size="lg" role="status" aria-hidden="true"/>
                    <p className="mb-0"> Loading...</p>
                </div>
            ) : (
                <Container className="mt-4 mb-5">
                    <Form onSubmit={handleShowModalKonfirmasi} className="mb-5">
                        <Row className="d-flex mb-4">
                            <Col md={5} sm={12} className="me-auto">
                                <Row >
                                    <Col md={12}className="me-auto">
                                        <h4 className="hijau">Detail Alamat</h4>
                                        <Card className={`mb-3 shadow-sm border-1 border-dark rounded-3 ${metode === 'Pickup' ? 'opacity-50 pe-none bg-white' : ''}`}> 
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <p className="h5 mb-0"> {alamatData.nama_penerima} <span className="text-muted">({alamatData.label_alamat})</span></p>    
                                                    <Button variant="light" className={metode === 'Pickup'? '' : 'text-decoration-underline'}
                                                        onClick={() => {metode === 'Pickup' 
                                                            ? null 
                                                            : navigate('/pembeli/ubahAlamat', { state: { alamat: alamatData } })}}
                                                        disabled={metode === 'Pickup'}
                                                    >
                                                        Ubah Alamat
                                                    </Button>
                                                </div>
                                                <p className="mb-0 text-muted">{alamatData.no_hp}</p>
                                                <p className="mb-1 text-muted">{alamatData.nama_alamat}</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={12} className="me-auto" >
                                        <h4 className="hijau">Metode Pengiriman</h4>
                                        <h6 className="text-muted">Silakan pilih metode pengiriman Anda</h6>
                                        <Card className="mb-3 shadow-sm border-1 border-dark rounded-3  "> 
                                            <Card.Body>
                                                <div className="d-flex align-items-center">
                                                    <input type="checkbox" className="checkHijau me-3" 
                                                        id="kurirCheckbox"
                                                        checked={metode == 'kurir'}
                                                        onChange={() => handleCheckMetode('kurir')}
                                                    />   
                                                    <label htmlFor="kurirCheckbox" className="mb-0 cursor-pointer">
                                                        Kurir Reusemart
                                                    </label>
                                                </div>
                                                
                                                <p className="border-bottom border-1 border-dark mt-3"></p>

                                                <div className="d-flex align-items-center">
                                                    <input type="checkbox" className="checkHijau me-3" 
                                                        id="pickupCheckbox"
                                                        checked={metode == 'pickup'}
                                                        onChange={() => handleCheckMetode('pickup')}
                                                    />   
                                                    <label htmlFor="pickupCheckbox" className="mb-0 cursor-pointer">
                                                        Ambil Sendiri
                                                    </label>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>

                            <Col md={6} sm={12}>
                                <Row>
                                    <h4 className="hijau">Detail Pemesanan</h4>
                                    <Card className="mb-3 shadow-sm border-0 rounded-3">
                                        <Card.Body>
                                            {itemKeranjangChecked.length > 0 ? (
                                                itemKeranjangChecked.map((item) => (
                                                    <Card key={item.id_barang} className="border-1 border-dark rounded-3 p-2 mb-4">
                                                        <Card.Body className="d-flex align-items-center">
                                                            <div className="d-flex align-items-center ms-3">
                                                                <img src={`http://127.0.0.1:8000/storage/foto_barang/${item.barang.foto_barang}`} 
                                                                    alt={item.nama_barang} style={{ width: "80px", height: "80px", borderRadius: "5px" }} className="me-3" />
                                                                <div>
                                                                    <h5 className="">{item.barang.nama_barang}</h5>
                                                                    <h5 className="mb-0 fw-bold">Rp. {item.harga_barang.toLocaleString("id-ID")}</h5>
                                                                </div>
                                                            </div>
                                                            
                                                        </Card.Body>
                                                    </Card>
                                                ))
                                            ) : (
                                                <Alert variant="warning" className="text-center"> 
                                                    <p className="mb-0">Tidak ada barang yang dipilih!</p>
                                                </Alert>
                                            )}
                                            
                                            <div className="d-flex justify-content-between align-items-center">
                                                <Form.Label className="hijau h5">Poin yang ingin ditukar </Form.Label>
                                                <div className="d-flex align-items-center mb-2" style={{ maxWidth: '200px' }}>
                                                    <Button 
                                                    variant="outline-danger" 
                                                    onClick={decrement}
                                                    disabled={pakaiPoin <= 0}
                                                    >
                                                    -
                                                    </Button>
                                                    
                                                    <Form.Control
                                                    type="number"
                                                    min="0"
                                                    max={maxPoin}
                                                    value={pakaiPoin}
                                                    onChange={handlePoin}
                                                    className="text-center mx-2"
                                                    />
                                                    
                                                    <Button 
                                                    variant="outline-success" 
                                                    onClick={increment}
                                                    disabled={pakaiPoin >= maxPoin}
                                                    >
                                                    +
                                                    </Button>
                                                </div>
                                                
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p className="h6 text-muted">
                                                    Poin tersedia: {maxPoin} points <br />
                                                    Sisa poin: {maxPoin - pakaiPoin} points
                                                </p>
                                                <p className="h6 text-muted">
                                                    Poin hanya berlaku untuk barang dan <br />
                                                    tidak berlaku untuk biaya pengiriman
                                                </p>
                                            </div>
                                            
                                        </Card.Body>
                                        
                                    </Card>
                                </Row>

                                <Row className="mt-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="">Subtotal ({itemKeranjangChecked.length} barang)</h4>
                                        <h4 className="text-muted">Rp{totalHargaBarang.toLocaleString('id-ID')}</h4>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="">Biaya Pengiriman</h4>
                                        <h4 className="text-muted">Rp{data.ongkos.toLocaleString('id-ID')}</h4>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="">Diskon Poin</h4>
                                        <h4 className="text-muted">-Rp{diskonPoin.toLocaleString('id-ID')}</h4>
                                    </div>
                                    <p className="border-bottom border-1 border-dark mt-3"></p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="hijau">Total Pembayaran</h4>
                                        <h4 className="">Rp{data.total_harga.toLocaleString('id-ID')}</h4>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="text-muted">Poin dari pesanan ini</h5>
                                        <h5 className="hijau">+{data.poin_didapatkan} points</h5>
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <Button className="btnHijau mt-3 rounded-pill w-75" type="submit" disabled={isLoading || itemKeranjangChecked.length === 0}>
                                            KONFIRMASI PESANAN
                                        </Button>
                                    </div>
                                </Row>
                            </Col>
                            
                        </Row>
                    </Form>
                </Container>    
            )}
            
        </>
    );
}

export default CheckoutPage;