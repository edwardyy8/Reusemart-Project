import { Navbar, Nav, Form, Button, Container } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/images/logoreuse.png";
import reusemart from "../assets/images/titlereuse.png";

const SideBarPegawai = ({ routes }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "rgb(242, 234, 226)",
        padding: "1rem",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <Navbar className="flex-column align-items-start">
        <Navbar.Brand
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
          className="mb-4 mx-auto border-bottom borderHijauBwh"
        >
          <img src={reusemart} height="60" alt="Logo" />

        </Navbar.Brand>

        <Nav className="flex-column w-100">
          {routes.map((route, index) => (
            <Nav.Link key={index} onClick={() => navigate(route.path)}>
              <Button
                variant="link"
                className={`w-100 text-start text-decoration-none btnHoverHijau ${
                  location.pathname === route.path
                    ? "btnHijau"
                    : "hijau"
                }`}
              >
                <h5>{route.name}</h5>
              </Button>
            </Nav.Link>
          ))}

        </Nav>
      </Navbar>
    </div>
  );
};

export default SideBarPegawai;