import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner, Stack, Button } from "react-bootstrap";

import { BsTelephone, BsInstagram, BsGeoAlt } from "react-icons/bs";
import FooterBar from "../../../components/FooterBar";

import reusemart from "../../../assets/images/titlereuse.png";


const KelolaOrganisasiPage = () => {
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
        
        <Container style={{ background: "rgba(231, 224, 218, 1)" }} fluid className="p-0">
           
            
            <Container className="mb-5">
                <div className="d-flex justify-content-center align-items-center flex-column">
                    <img src={reusemart} alt="ReuseMart" />
                    <h1 className="hijau">Letak slogan aja la di sini we tp gatau slogan apa wkwkkwk</h1>
                </div>
                
            </Container>
            <FooterBar />
        </Container>
            
        
    );
};

export default KelolaOrganisasiPage;

