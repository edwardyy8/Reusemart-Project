import { Container, Stack, Col, Row } from "react-bootstrap";

import { BsTelephone, BsInstagram, BsGeoAlt } from "react-icons/bs";

const FooterBar = () => {

    return (
        <Container fluid style={{ backgroundColor: "white", boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.3)" }} className="mb-0" >
            <Row gap={3} xs={12} sm={12} md={12} lg={8} xl={4} className="p-4" style={{ color: "rgba(83, 83, 83, 1)" }}>
                <p className="h5 mb-0"><BsTelephone /> +6281234567899</p>
                <p className="h5 mb-0"><BsInstagram /> @reusemart.yogyakarta</p>
                <p className="h5 mb-0"><BsGeoAlt /> Jl. Babarsari no.111</p>
            </Row>

        </Container>
    );
};

export default FooterBar;


