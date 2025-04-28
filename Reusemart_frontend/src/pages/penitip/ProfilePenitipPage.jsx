import { Container } from "react-bootstrap";


import reusemart from "../../assets/images/titlereuse.png";


const ProfilePenitipPage = () => {
  return (
    <Container className="mt-5">
      <div className="text-center mb-3 d-flex flex-row justify-content-center align-items-center gap-3">
        <img src={reusemart} alt="ReuseMart" />
        <h1 className="mt-1 pb-1 hijau" >Welcome profile Penitip </h1>
      </div>

      
    </Container>
  );
};

export default ProfilePenitipPage;
