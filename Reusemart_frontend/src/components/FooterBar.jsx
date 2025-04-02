import { Container, Stack } from "react-bootstrap";

import { BsTelephone, BsInstagram, BsGeoAlt } from "react-icons/bs";

const FooterBar = () => {

    return (
        <Container fluid style={{ backgroundColor: "white", boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.3)" }} className="mb-0" >
            <Stack direction="horizontal" gap={3} className="p-4" style={{ color: "rgba(83, 83, 83, 1)" }}>
                <p className="h5 mb-0"><BsTelephone /> +6281234567899</p>
                <p className="h5 mb-0"><BsInstagram /> @reusemart.yogyakarta</p>
                <p className="h5 mb-0"><BsGeoAlt /> Jl. Babarsari no.111</p>
            </Stack>

        </Container>
    );
};

export default FooterBar;


