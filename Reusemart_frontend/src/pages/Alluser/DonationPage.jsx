import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner, Stack, Button } from "react-bootstrap";

import { BsCaretRightFill } from "react-icons/bs";
import FooterBar from "../../components/FooterBar";

import reusemart from "../../assets/images/titlereuse.png";

import { GetAllDonasis } from "../../api/apiDonasi";

const DonationPage = () => {
    const [donasis, setDonasis] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const formatTanggal = (tanggal) => {
        const options = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        };
        return new Date(tanggal).toLocaleDateString('id-ID', options);
    };

    const fetchDonasis = () => { 
        setIsLoading(true); 
        GetAllDonasis()
        .then((data) => {
            setDonasis(data);
            console.log(data);
            setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
        });
    };

      useEffect(() => {
        fetchDonasis();
      }, []);

    const navigate = useNavigate();

    return (
        <>
            <Container fluid className="py-3 shadow-sm my-3 abu83 px-5" style={{ backgroundColor: "rgba(252, 251, 249, 1)" }}>
                <div className="d-flex align-items-center">
                    <h5 className="mb-0">DONATION</h5>
                    <BsCaretRightFill className="ms-2" />
                </div>
            </Container>

            <Container fluid className="px-5 mb-5" >
                
                {isLoading ? (
                    <div className="text-center">
                        <Spinner
                            as="span"
                            animation="border"
                            variant="primary"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                        />
                        <p className="mb-0">Loading...</p>
                    </div>
                ) : (
                    <Container fluid className="px-4" >
                        { Object.keys(donasis).length ? (
                            <Stack direction="vertical" gap={3} className="mb-3 p-2">
                                {Object.entries(donasis).map(([tanggal, donasiHarini]) => (
                                    <>
                                        <div key={tanggal}>
                                            <h5 className="mb-0">{formatTanggal(tanggal)}</h5>
                                        </div>

                                        {donasiHarini.map((donasi) => (
                                            <Row key={donasi.id} className="border border-dark rounded-3 mx-1 p-3" style={{ backgroundColor: "rgba(242, 234, 226, 1)" }}>
                                                <Col xs={12} md={4} className="d-flex align-items-center">
                                                    <div className="d-flex flex-row gap-3 align-items-center">
                                                        <img src={reusemart} height="60" className="d-inline-block " alt="Logo" />

                                                        <h5 className="mb-0">{donasi.nama_barang}</h5>
                                                        
                                                    </div>
                                                </Col>
                                                <Col xs={12} md={4} className="d-flex align-items-center justify-content-center">
                                                    <div className="d-flex flex-row align-items-center">
                                                        <h6 className="mb-0">Didonasikan Ke</h6>
                                                    </div>
                                                </Col>
                                                <Col xs={12} md={4} className="d-flex align-items-center justify-content-end">
                                                    <div className="d-flex flex-row gap-3 align-items-center">
                                                        <h5 className="mb-0">{donasi.nama_organisasi}</h5>
                                                        
                                                        <img src={reusemart} height="60" className="d-inline-block rounded-1" alt="Logo" />
                                                    </div>
                                                </Col>
                                            </Row>

                                        ))}
                                    
                                    </>
                                ))}
                                
                            </Stack>   
                        ) : (
                            <Alert variant="success" className="mt-3 text-center"> 
                                Belum ada Histori Donasi! {donasis.length}
                            </Alert>
                        )} 
                    </Container>
                )}
            </Container>
            
            <FooterBar />
            
        </>
    );
};

export default DonationPage;

