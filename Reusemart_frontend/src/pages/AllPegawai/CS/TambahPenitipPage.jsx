import { Container } from "react-bootstrap";
import FormPenitip from "../../components/forms/FormPenitip";

import reusemart from "../../assets/images/titlereuse.png";


const TambahPenitipPage = () => {
  return (
    <Container className="mt-5">
      <div className="text-center mb-3 d-flex flex-row justify-content-center align-items-center gap-3">
        <img src={reusemart} alt="ReuseMart" />
        <h1 className="mt-1 pb-1 hijau" >T A M B A H</h1>
        <h1 className="mt-1 pb-1 hijau" >P E N I T I P</h1>
      </div>

      <FormPenitip />
    </Container>
  );
};

export default TambahPenitipPage;
