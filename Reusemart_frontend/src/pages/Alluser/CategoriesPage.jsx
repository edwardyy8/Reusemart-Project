import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner, Stack, Button, Card } from "react-bootstrap";

import { BsArrowRight, BsCaretRightFill } from "react-icons/bs";

import FooterBar from "../../components/FooterBar";

import reusemart from "../../assets/images/titlereuse.png";

import { GetAllBarangs } from "../../api/apiBarang";

const CategoriesPage = () => {
    const [barangs, setBarangs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBarangs = () => { 
        setIsLoading(true); 
        GetAllBarangs()
        .then((data) => {
            setBarangs(data);
            console.log(data);
            setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
        });
    };
    
    useEffect(() => {
        fetchBarangs();
    }, []);

    const navigate = useNavigate();
    
    return (
        <>
            <Container fluid className="py-3 shadow-sm my-3 abu83 px-5" style={{ backgroundColor: "rgba(252, 251, 249, 1)" }}>
                <div className="d-flex align-items-center">
                    <h5 className="mb-0">KATEGORI</h5>
                    <h5 className="mb-0"><BsCaretRightFill className="ms-2" /></h5>

                    <Row className="ms-2 g-1">
                        <Row className="mb-2">
                            <Col>Elektronik & Gadget<BsCaretRightFill className="ms-2" /></Col>
                            <Col>Perlengkapan Bayi & Anak<BsCaretRightFill className="ms-2" /></Col>
                            <Col>Perabotan Rumah Tangga <BsCaretRightFill className="ms-2" /></Col>
                            <Col>Buku, Alat Tulis, & Peralatan Sekolah<BsCaretRightFill className="ms-2" /></Col>
                            <Col>Hobi, Mainan, & Koleksi<BsCaretRightFill className="ms-2" /></Col>
                        </Row>
                        <Row>
                            <Col>Otomotif & Aksesori<BsCaretRightFill className="ms-2" /></Col>
                            <Col>Kosmetik & Perawatan diri<BsCaretRightFill className="ms-2" /></Col>
                            <Col>Peralatan Kantor & Industri<BsCaretRightFill className="ms-2" /></Col>
                            <Col>Perlengkapan Taman & Outdoor<BsCaretRightFill className="ms-1" /></Col>
                            <Col>Pakaian & Aksesori<BsCaretRightFill className="ms-2" /></Col>
                        </Row>
                    </Row>
                </div>
            </Container>

            <Container fluid className="p-5">
                <h1>PRODUK TERBARU</h1>
                <h5 style={{color: "rgba(142, 150, 142, 1)"}}>Dapatkan barang ini sebelum kehabisan!</h5>
                
                {isLoading ? (
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
                ) : (
                    <Container fluid className="px-0 my-3">
                        <Row className="g-4">
                            {barangs.length > 0 && barangs.map((barang) => (
                                <Col key={barang.id_barang} xs={7} sm={6} md={4} lg={2}>
                                    <Card className="position-relative shadow-sm rounded-3 l" onClick={() => navigate(`/barang/${barang.id_barang}`)} style={{ cursor: "pointer" }}>
                                        <div className="position-relative">
                                            <Card.Img variant="top" src={reusemart} alt={barang.nama_barang} style={{width: "200px", height: "200px"}}/>
                                            <Button 
                                                variant="light" 
                                                size="sm" 
                                                className="position-absolute bottom-0 start-0 m-2 abu83"
                                                >
                                                    Details <BsArrowRight />
                                            </Button>
                                        </div>
                                        <Card.Body>
                                            <Card.Title className="fs-6">{barang.nama_barang}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                        
                )}

                <h1 className="mt-5">PENJUAL TERPOPULER</h1>
                <h5 style={{color: "rgba(142, 150, 142, 1)"}}>Penjual ReuseMart dengan Produk Terlaris</h5>
            
            </Container>

            <FooterBar />
        </>   
        
    );
};

export default CategoriesPage;

