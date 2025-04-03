import { Container } from "react-bootstrap";
import FormRegister from "../../components/forms/FormRegister";

import reusemart from "../../assets/images/titlereuse.png";


const RegisterPage = () => {
  return (
    <Container className="mt-5">
      <div className="text-center mb-3 d-flex flex-row justify-content-center align-items-center gap-3">
        <img src={reusemart} alt="ReuseMart" />
        <h1 className="mt-1 pb-1 hijau" >R E G I S T R A S I </h1>
      </div>

      <FormRegister />
    </Container>
  );
};

export default RegisterPage;
