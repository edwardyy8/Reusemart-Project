import { useEffect, useState } from "react";
import { Alert, Col, Container, Row, Spinner, Table, Pagination, Button } from "react-bootstrap";
import { GetAllDonasis } from "../../../api/apiDonasi";
import { useNavigate } from 'react-router-dom';

const KelolaDonasiPage = () => {
    const [donasis, setDonasis] = useState([]);
    const [filteredDonasis, setFilteredDonasis] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState("");
    const [currentPage, setCurrentPage] = useState(1); 
    const [itemsPerPage] = useState(10); 

    const navigate = useNavigate(); 

    useEffect(() => {
        fetchDonasis();
    }, []);

    const fetchDonasis = () => {
        setIsLoading(true);
        GetAllDonasis()
            .then((data) => {
                const donasiData = Object.values(data).flat();
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

    useEffect(() => {
        if (!selectedOrg) {
            setFilteredDonasis(donasis);
        } else {
            setFilteredDonasis(donasis.filter(donasi => donasi.nama === selectedOrg));
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDonasis.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        if (pageNumber > totalPages) {
            setCurrentPage(totalPages);
        } else if (pageNumber < 1) {
            setCurrentPage(1);
        } else {
            setCurrentPage(pageNumber);
        }
    };

    const uniqueOrganizations = [...new Set(donasis.map(d => d.nama))];
    const totalPages = Math.ceil(filteredDonasis.length / itemsPerPage);

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
                    <Button className="border-0" style={{ backgroundColor: "rgba(4, 121, 2, 1)" }} onClick={() => navigate("/pegawai/Owner/kelolaDonasi/tambahDonasiOwner")}>+ Tambah</Button>
                </div>

                {donasis.length === 0 && !isLoading ? (
                    <Alert variant="warning" className="text-center">
                        <h5>Belum ada donasi yang terdaftar. Silakan tambahkan donasi baru.</h5>
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
                                {currentItems.map((donasi) => (
                                    <tr key={donasi.id_donasi}>
                                        <td>{donasi.id_donasi}</td>
                                        <td>{donasi.nama}</td>
                                        <td>{formatTanggal(donasi.tanggal_donasi)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {totalPages > 1 && (
                            <Pagination>
                                {[...Array(totalPages)].map((_, index) => (
                                    <Pagination.Item
                                        key={index + 1}
                                        active={index + 1 === currentPage}
                                        onClick={() => paginate(index + 1)}
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                        )}
                    </>
                )}
            </Container>
        </Container>
    );
};

export default KelolaDonasiPage;
