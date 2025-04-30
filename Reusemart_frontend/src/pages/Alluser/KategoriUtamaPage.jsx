import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

import FooterBar from "../../components/FooterBar";
import reusemart from "../../assets/images/titlereuse.png";
import { GetBarangByCategory } from "../../api/apiBarang";

const KategoriUtamaPage = () => {
    const [barangs, setBarangs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { id, subkategoriName } = useParams();  // Retrieve both category ID and subcategory name

    useEffect(() => {
        setIsLoading(true);
        GetBarangByCategory(id)
            .then((data) => {
                setBarangs(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }, [id]);

    const navigate = useNavigate();

    return (
        <>
            {/* Main wrapper with flex layout */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    backgroundColor: "rgba(252, 251, 249, 1)", // Ensuring background covers entire page
                }}
            >
                <Container
                    fluid
                    className="py-3 shadow-sm my-3 abu83 px-5"
                    style={{ flexGrow: 0 }} // Ensures no extra space is added here
                >
                    <div className="d-flex align-items-center">
                        <h5 className="mb-0">KATEGORI</h5>
                        <h5 className="mb-0">
                            {" "}
                            <BsArrowRight />{" "}
                        </h5>

                        <Row className="ms-2 g-1">
                            <Col>{subkategoriName || "Kategori Utama"}</Col>
                        </Row>
                    </div>
                </Container>

                <Container fluid className="p-5" style={{ flexGrow: 1 }}>
                    <h1>PRODUK TERKAIT</h1>
                    <h5 style={{ color: "rgba(142, 150, 142, 1)" }}>
                        Dapatkan barang ini sebelum kehabisan!
                    </h5>

                    {isLoading ? (
                        <div className="text-center">
                            <Spinner animation="border" variant="success" size="lg" role="status" aria-hidden="true" />
                            <p className="mb-0">Loading...</p>
                        </div>
                    ) : (
                        <Row className="g-4 mt-3">
                            {barangs.length > 0 ? (
                                barangs.map((barang) => (
                                    <Col key={barang.id_barang} xs={6} sm={4} md={3} lg={2}>
                                        <Card
                                            className="h-100 shadow-sm"
                                            onClick={() => navigate(`/barang/${barang.id_barang}`)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Card.Img
                                                variant="top"
                                                src={reusemart}
                                                alt={barang.nama_barang}
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                            <Card.Body>
                                                <Card.Title>{barang.nama_barang}</Card.Title>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))
                            ) : (
                                <p>Tidak ada produk tersedia.</p>
                            )}
                        </Row>
                    )}
                </Container>

                {/* Footer will always stay at the bottom */}
                <FooterBar />
            </div>
        </>
    );
};

export default KategoriUtamaPage;
