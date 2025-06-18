import { Carousel } from "react-bootstrap";

const ImageCarouselModal = ({ images }) => {
  return (
    <Carousel>
      {images?.map((image, index) => (
        <Carousel.Item key={index}>
          <img className="d-block rounded-2 mb-2" src={image.img} alt={image.title} style={{objectFit: 'cover', height: '200px', width: '200px' }} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ImageCarouselModal;
