import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { GetAllBarangs } from "../../api/apiBarang";

const SearchResultsPage = () => {
    const [barangs, setBarangs] = useState([]);
    const [filteredBarangs, setFilteredBarangs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search).get("query") || "";

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const allBarangs = await GetAllBarangs();
                setBarangs(allBarangs);

                const filtered = allBarangs.filter((barang) =>
                    barang.nama_barang.toLowerCase().includes(query.toLowerCase())
                );
                setFilteredBarangs(filtered);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [query]);

    return (
        <Container className="py-5" style={{ marginTop: "80px" }}>
            <h2>Hasil Pencarian: "{query}"</h2>
            {isLoading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="success" />
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
                                    <Card.Img
                                        variant="top"
                                        src={barang.gambar || "https://via.placeholder.com/150"}
                                        alt={barang.nama_barang}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <Card.Body>
                                        <Card.Title className="fs-6">{barang.nama_barang}</Card.Title>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p>Tidak ada produk ditemukan.</p>
                    )}
                </Row>
            )}
        </Container>
    );
};

export default SearchResultsPage;
