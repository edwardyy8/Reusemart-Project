import { Container } from "react-bootstrap";

import FormResetPass from "../../components/forms/FormResetPass";

import reusemart from "../../assets/images/titlereuse.png";

const ResetPassPage = () => {
  return (
    <Container className="mt-5">
      <div className="text-center mb-3 d-flex flex-row justify-content-center align-items-center gap-3">
          <img src={reusemart} alt="ReuseMart" />
          <div className="d-flex flex-column justify-content-center text-start">
            <h1 className="mt-1 pb-1 hijau text-start" >R E S E T </h1>
            <h1 className="mt-1 pb-1 hijau text-start" >K A T A S A N D I </h1>
          </div>
      </div>

      <FormResetPass />
    
    </Container>
  );
}

export default ResetPassPage;
