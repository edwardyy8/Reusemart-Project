import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner, Stack, Button } from "react-bootstrap";

import { BsTelephone, BsInstagram, BsGeoAlt } from "react-icons/bs";

import ImageCarousel from "../components/ImageCarousel";
import carou1 from "../assets/images/perlengkapantaman.png";
import carou2 from "../assets/images/carou2.png";
import carou3 from "../assets/images/musikkoleksi.png";
import reusemart from "../assets/images/titlereuse.png";

const images = [
    {
      img: carou2,
    },
    {
      img: carou3,
    },
  ];

const HomePage = () => {
    //   const [contents, setContents] = useState([]);
    //   const [isLoading, setIsLoading] = useState(false);

    //   useEffect(() => {
    //     setIsLoading(true);
    //     GetAllContents()
    //       .then((data) => {
    //         setContents(data);
    //         setIsLoading(false);
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    //   }, []);

    const navigate = useNavigate();

    return (
        <>
            <ImageCarousel images={images} />
            <Container className="mt-4">
                <Stack direction="horizontal" gap={3} className="mb-3">
                    <h1 className="h4 fw-bold mb-0 text-nowrap">Rekomendasi Untukmu</h1>
                    <hr className="border-top border-light opacity-50 w-100" />
                </Stack>

            </Container>
            <Container className="mt-4 mb-5">
                <div className="d-flex justify-content-center align-items-center flex-column">
                    <img src={reusemart} alt="ReuseMart" />
                    <h1 className="hijau">Letak slogan aja la di sini we tp gatau slogan apa wkwkkwk</h1>
                </div>
                
            </Container>
            <Container fluid style={{ backgroundColor: "white", boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.3)" }} className="mb-0" >
                <Stack direction="horizontal" gap={3} className="p-4" style={{ color: "rgba(83, 83, 83, 1)" }}>
                    <p className="h5 mb-0"><BsTelephone /> +6281234567899</p>
                    <p className="h5 mb-0"><BsInstagram /> @reusemart.yogyakarta</p>
                    <p className="h5 mb-0"><BsGeoAlt /> Jl. Babarsari no.111</p>
                </Stack>

            </Container>
            
        </>
    );
};

export default HomePage;

