import { useState, useEffect } from "react";
import { Container, Card, Spinner, Alert, Row, Col, Button, Form } from "react-bootstrap";
import { BsCaretRightFill } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useKeranjang } from "../../context/KeranjangContext";
import { HandleSelectKeranjang, DeleteKeranjang, DeleteKeranjangHabis } from "../../api/apiKeranjang";


const KeranjangPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const { 
        itemKeranjang, setItemKeranjang, fetchKeranjang, totalHargaBarang, 
        itemKeranjangChecked, setItemKeranjangChecked,
        itemHabis, setItemHabis
    } = useKeranjang();

    const submitCheckbox = async (id) => {
        setIsLoading(true);
        try {
            const response = await HandleSelectKeranjang(id);
            fetchKeranjang();
        } catch (error) {
            console.error("Gagal memilih barang:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDelete = async (id) => {
        setIsLoading(true);
        try {
            const response = await DeleteKeranjang(id);
            fetchKeranjang();
        } catch (error) {
            console.error("Gagal menghapus barang:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteHabis = async (id) => {
        setIsLoading(true);
        try {
            const response = await DeleteKeranjangHabis(id);
            fetchKeranjang();
        } catch (error) {
            console.error("Gagal menghapus barang habis:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        
    }, []);


    return (
        <>
            <Container fluid className="py-3 shadow-sm my-3 abu83 px-5" style={{ backgroundColor: "rgba(252, 251, 249, 1)" }}>
                <div className="d-flex align-items-center">
                    <h5 className="mb-0">KERANJANG SAYA</h5>
                    <BsCaretRightFill className="ms-2" />
                </div>
            </Container>
            
            <Container className="mt-4 mb-5">
               <Row>
                    <Col md={8}>
                        <Card className="mb-3 shadow-sm border-0 rounded-3">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="fw-bold">Keranjang</h4>
                                </div>
                                
                                {itemKeranjang.length > 0 ? (
                                    itemKeranjang.map((item) => (
                                        <Card key={item.id_barang} className="border-1 border-dark rounded-3 p-2 mb-4">
                                            <Card.Body className="d-flex align-items-center">
                                                <input type="checkbox" className="checkHijau" 
                                                    checked={item.is_selected} 
                                                    onChange={() => submitCheckbox(item.id_keranjang)}
                                                />
                                                <div className="d-flex align-items-center ms-3">
                                                    <img src={`http://127.0.0.1:8000/storage/foto_barang/${item.barang.foto_barang}`} 
                                                        alt={item.nama_barang} style={{ width: "80px", height: "80px", borderRadius: "5px" }} className="me-3" />
                                                    <div>
                                                        <h5 className="">{item.barang.nama_barang}</h5>
                                                        <h5 className="mb-0 fw-bold">Rp. {item.harga_barang.toLocaleString("id-ID")}</h5>
                                                    </div>
                                                </div>
                                                <Button className="bg-white border-0 shadow-sm ms-auto" 
                                                    onClick={() => handleDelete(item.id_keranjang)} 
                                                    disabled={isLoading}>
                                                        <FaRegTrashCan className="hijau"/>     
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    ))
                                ) : (
                                    <Alert variant="warning" className="text-center"> 
                                        <p className="mb-0">Keranjang Anda masih kosong!</p>
                                    </Alert>
                                )}
                                
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="mb-3 shadow-sm border-0 rounded-3">
                            <Card.Body>
                                <h4 className="fw-bold mb-3">Ringkasan Belanja</h4>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5>Total: </h5>
                                    <h5 className="hijau fw-bold">Rp. {totalHargaBarang.toLocaleString("id-ID")}</h5>
                                </div>
                            </Card.Body>
                            <Card.Footer>
                                <Button className="w-100 btnHijau" onClick={() => navigate("/pembeli/checkout")} 
                                    disabled={itemKeranjangChecked.length === 0 || isLoading}>
                                        Checkout ({itemKeranjangChecked.length})
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
               </Row>
               {itemHabis.length > 0 && (
                    <Row>
                        <Col md={8}>
                            <Card className="shadow-sm mb-4 rounded-3 mt-3 border-top-0 border-start-0 border-end-0">
                                <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">Stok Habis</h5>
                                    <Button className="mb-0 bg-white hijau border-0" onClick={() => handleDeleteHabis()} disabled={isLoading}> 
                                    <h5 className="mb-0"> Hapus ({itemHabis.length})</h5>
                                    </Button>
                                </Card.Header>
                                <ul className="list-group list-group-flush">
                                    {itemHabis.map((item) => (
                                        <li key={item.id_barang} className="list-group-item">
                                            <Card.Body key={item.id_barang} className="d-flex align-items-center">
                                                <div className="d-flex align-items-center ms-3">
                                                    <img src={`http://127.0.0.1:8000/storage/foto_barang/${item.barang.foto_barang}`} 
                                                        alt={item.nama_barang} style={{ width: "80px", height: "80px", borderRadius: "5px", opacity: "80%" }} className="me-3" />
                                                    <div>
                                                        <h5 className="text-muted">{item.barang.nama_barang}</h5>
                                                        <h5 className="mb-0 fw-bold text-muted">Rp. {item.harga_barang.toLocaleString("id-ID")}</h5>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </Col>
                    </Row>
               )}
            </Container>
            
        </>
    );
}

export default KeranjangPage;