import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Col, Container, Row, Spinner, Stack, Button } from "react-bootstrap";

import { BsTelephone, BsInstagram, BsGeoAlt } from "react-icons/bs";
import FooterBar from "../../components/FooterBar";

import ImageCarousel from "../../components/ImageCarousel";
import carou1 from "../../assets/images/1.png";
import carou2 from "../../assets/images/2.png";
import carou3 from "../../assets/images/3.png";
import gambar1 from "../../assets/images/carou2.png";
import gambar2 from "../../assets/images/musikkoleksi.png";
import reusemart from "../../assets/images/titlereuse.png";

const images = [
    {
      img: carou1,
    },
    {
      img: gambar1,
    },
    {
      img: gambar2,
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
        
        <Container style={{ background: "rgba(231, 224, 218, 1)" }} fluid className="p-0">
            <ImageCarousel images={images} />
            
            
                <div className="d-flex justify-content-center align-items-center flex-column">

                    <img src={carou2} alt="gambar kategori" /> 

                </div>
                <div className="d-flex justify-content-center align-items-center flex-column">
                    <img src={carou3} alt="gambar kategori" />
                    
                </div>
                {/* <div className="d-flex justify-content-center align-items-center flex-column">
                    <img src={reusemart} alt="ReuseMart" />
                    <h4 className="hijau mb-0">Technology meets mindful living.</h4>
                    <h4 className="hijau"> Where every purchase helps create a greener earth for the future.</h4>
                </div> */}
            
            <FooterBar />
        </Container>
            
        
    );
};

export default HomePage;

