import { Container } from "react-bootstrap";
import FormEditPenitip from "../../../components/forms/FormEditPenitip";

import reusemart from "../../../assets/images/titlereuse.png";

const EditPenitipPage = () => {
  return (
    <Container className="mt-5">
      <div className="text-center mb-3 d-flex flex-row justify-content-center align-items-center gap-3">
        <img src={reusemart} alt="ReuseMart" />
        <h1 className="mt-1 pb-1 hijau" >E D I T</h1>
        <h1></h1>
        <h1 className="mt-1 pb-1 hijau" >P E N I T I P</h1>
      </div>

      <FormEditPenitip />
    </Container>
  );
};

export default EditPenitipPage;