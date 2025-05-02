import { Container } from "react-bootstrap";
import FormRequest from "../../components/forms/FormRequest";

import reusemart from "../../assets/images/titlereuse.png";


const CreateRequestPage = () => {
  return (
    <Container className="mt-5 pt-5">
      <div className="text-center mb-3 d-flex flex-row justify-content-center align-items-center gap-3">
        <img src={reusemart} alt="ReuseMart" />
        <h1 className="mt-1 pb-1 hijau" >T A M B A H</h1>
        <h1 className="mt-1 pb-1 hijau" >R E Q U E S T</h1>
      </div>

      <FormRequest />
    </Container>
  );
};

export default CreateRequestPage;
