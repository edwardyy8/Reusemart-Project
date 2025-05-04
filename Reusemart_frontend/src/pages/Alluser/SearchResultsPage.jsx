import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { BsArrowRight } from "react-icons/bs";
import { GetAllBarangs } from "../../api/apiBarang";
import reusemart from "../../assets/images/titlereuse.png";
import FooterBar from "../../components/FooterBar";

const SearchResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("q");

    const [barangs, setBarangs] = useState([]);
    const [filteredBarangs, setFilteredBarangs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchBarangs = async () => {
            setIsLoading(true);
            try {
                const allBarangs = await GetAllBarangs();
                setBarangs(allBarangs);

                const keywords = searchQuery.split(",").map(k => k.trim().toLowerCase());

                const filtered = allBarangs.filter((barang) =>
                    keywords.some(keyword =>
                        barang.nama_barang.toLowerCase().includes(keyword)
                    )
                );

                setFilteredBarangs(filtered);
            } catch (error) {
                console.error("Error fetching barangs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (searchQuery) {
            fetchBarangs();
        }
    }, [searchQuery]);

    return (
        <>
            {/* Main wrapper with flex layout */}
            <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
                <Container className="pt-5 mb-5 flex-grow-1">
                    <p><b>Produk yg ditemukan:</b> <em>{decodeURIComponent(queryParams.get("q"))}</em></p>
                    {isLoading ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" variant="success" />
                            <p className="mt-2">Loading produk...</p>
                        </div>
                    ) : (
                        <Row className="g-4 mt-3">
                            {filteredBarangs.length > 0 ? (
                                filteredBarangs.map((barang) => (
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
                                <p>Tidak ditemukan produk dengan kata kunci tersebut.</p>
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

export default SearchResultPage;
