import { useEffect, useState } from "react";
import { Alert, Col, Container, Form, Row, Spinner, Table } from "react-bootstrap";
import { GetAllDonasis } from "../../../api/apiDonasi";

const HistoryDonasiPage = () => {
    const [donasis, setDonasis] = useState([]);
    const [filteredDonasis, setFilteredDonasis] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState("");

    useEffect(() => {
        fetchDonasis();
    }, []);

    const fetchDonasis = () => {
        setIsLoading(true);
        GetAllDonasis()
            .then((data) => {
                const donasiData = Object.values(data).flat();

                // Remove duplicates by ID or any unique field
                const uniqueDonasis = Array.from(new Set(donasiData.map((item) => item.id_donasi)))
                    .map(id => donasiData.find(item => item.id_donasi === id));

                setDonasis(uniqueDonasis);
                setFilteredDonasis(uniqueDonasis);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    // Filter donasi berdasarkan organisasi
    useEffect(() => {
        if (selectedOrg === "") {
            setFilteredDonasis(donasis);
        } else {
            const filtered = donasis.filter((donasi) => donasi.nama === selectedOrg);
            setFilteredDonasis(filtered);
        }
    }, [selectedOrg, donasis]);

    const formatTanggal = (tanggal) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(tanggal).toLocaleDateString('id-ID', options);
    };

    // Ambil nama organisasi unik
    const uniqueOrganizations = [...new Set(donasis.map(d => d.nama))];

    return (
        <Container fluid className="p-0">
            <Container className="boxHijau p-3 rounded-3 mb-4 mt-4 ms-3" style={{ width: "13vw" }}>
                <Row>
                    <Col>
                        <p>Jumlah </p>
                        <p>Donasi</p>
                    </Col>
                    <Col className="text-center d-flex justify-content-center align-items-center">
                        <h3>{filteredDonasis.length}</h3>
                    </Col>
                </Row>
            </Container>

            <Container className="mb-5 ms-0 me-0">
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <p className="" style={{ fontSize: "2vw" }}>HISTORY DONASI</p>
                </div>

                {/* Dropdown organisasi */}
                <Form.Group className="mb-3 d-flex align-items-center">
                    <Form.Label className="me-2">Nama Organisasi :</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedOrg}
                        onChange={(e) => setSelectedOrg(e.target.value)}
                        style={{ width: "200px" }}
                    >
                        <option value="">Semua Organisasi</option>
                        {uniqueOrganizations.map((org, index) => (
                            <option key={index} value={org}>
                                {org}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>

                {/* Kondisi data */}
                {donasis.length === 0 && !isLoading ? (
                    <Alert variant="warning" className="text-center">
                        <h5>Belum ada donasi yang terdaftar</h5>
                    </Alert>
                ) : isLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="success" size="lg" />
                        <p className="mb-0">Loading...</p>
                    </div>
                ) : (
                    <>
                        <Table bordered hover responsive>
                            <thead className="custom-table">
                                <tr>
                                    <th>ID Donasi</th>
                                    <th>Nama Organisasi</th>
                                    <th>Tanggal Donasi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDonasis.map((donasi) => (
                                    <tr key={donasi.id_donasi}>
                                        <td>{donasi.id_donasi}</td>
                                        <td>{donasi.nama}</td>
                                        <td>{formatTanggal(donasi.tanggal_donasi)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                )}
            </Container>
        </Container>
    );
};

export default HistoryDonasiPage;
