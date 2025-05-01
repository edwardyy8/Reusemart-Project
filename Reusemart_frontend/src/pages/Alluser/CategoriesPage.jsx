import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Accordion, Spinner } from "react-bootstrap";
import { BsArrowRight } from "react-icons/bs";

import FooterBar from "../../components/FooterBar";
import reusemart from "../../assets/images/titlereuse.png";

import { GetAllBarangs } from "../../api/apiBarang";
import { GetAllKategoris } from "../../api/apiKategori";

const CategoriesPage = () => {
    const [barangs, setBarangs] = useState([]);
    const [kategoris, setKategoris] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingKategori, setIsLoadingKategori] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setIsLoadingKategori(true);
            try {
                const [barangData, kategoriData] = await Promise.all([
                    GetAllBarangs(),
                    GetAllKategoris()
                ]);
                setBarangs(barangData);
                setKategoris(kategoriData);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
                setIsLoadingKategori(false);
            }
        };

        fetchData();
    }, []);

    // Group kategori jadi kategori utama dan subkategori
    const groupedKategoris = kategoris.reduce((acc, kategori) => {
        const id = kategori.id_kategori;
        if (id % 10 === 0) {
            // Kategori utama
            acc[id] = { ...kategori, subcategories: [] };
        } else {
            // Subkategori
            const mainCategoryId = Math.floor(id / 10) * 10;
            if (!acc[mainCategoryId]) {
                acc[mainCategoryId] = { subcategories: [] };
            }
            acc[mainCategoryId].subcategories.push(kategori);
        }
        return acc;
    }, {});

    return (
        <>
            <Container fluid className="d-flex" style={{ minHeight: "100vh", backgroundColor: "rgba(252, 251, 249, 1)" }}>
                {/* Sidebar kategori */}
                <div className="p-3 shadow-sm" style={{ width: "250px", backgroundColor: "#ffffff" }}>
                <h5 className="mb-4 mt-4">KATEGORI</h5>

                {isLoadingKategori ? (
                    <p>Loading kategori...</p>
                ) : (
                    <Accordion alwaysOpen>
                        {Object.entries(groupedKategoris).map(([mainId, mainKategori], idx) => (
                            <Accordion.Item eventKey={idx.toString()} key={mainId}>
                                <Accordion.Header>{mainKategori.nama_kategori || "Kategori"}</Accordion.Header>
                                <Accordion.Body>
                                    {mainKategori.subcategories.length > 0 ? (
                                        mainKategori.subcategories.map((sub) => (
                                            <div
                                                key={sub.id_kategori}
                                                className="mb-2"
                                                onClick={() => navigate(`/kategori/${sub.id_kategori}/${sub.nama_kategori}`)}  // Pass subcategory name to the next page
                                                style={{ cursor: "pointer", color: "#555" }}
                                            >
                                                - {sub.nama_kategori}
                                            </div>
                                        ))
                                    ) : (
                                        <div
                                            onClick={() => navigate(`/kategori/${mainKategori.id_kategori}`)}
                                            style={{ cursor: "pointer", color: "#555" }}
                                        >
                                            (Tidak ada subkategori)
                                        </div>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )}
            </div>

                {/* Konten produk */}
                <Container fluid className="p-5">
                    <h1>PRODUK TERBARU</h1>
                    <h5 style={{ color: "rgba(142, 150, 142, 1)" }}>Dapatkan barang ini sebelum kehabisan!</h5>

                    {isLoading ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" variant="success" />
                            <p className="mt-2">Loading produk...</p>
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
                                            <div className="position-relative">
                                                <Card.Img
                                                    variant="top"
                                                    src={reusemart}
                                                    alt={barang.nama_barang}
                                                    style={{ height: "200px", objectFit: "cover" }}
                                                />
                                                <Button
                                                    variant="light"
                                                    size="sm"
                                                    className="position-absolute bottom-0 start-0 m-2"
                                                >
                                                    Details <BsArrowRight />
                                                </Button>
                                            </div>
                                            <Card.Body>
                                                <Card.Title className="fs-6">{barang.nama_barang}</Card.Title>
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
            </Container>

            <FooterBar />
        </>
    );
};

export default CategoriesPage;
