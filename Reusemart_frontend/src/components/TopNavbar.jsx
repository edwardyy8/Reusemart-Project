import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Button, Form } from "react-bootstrap";
import logo from "../assets/images/logoreuse.png";
import { FaSearch } from 'react-icons/fa';

const TopNavbar = ({ routes }) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/");
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchKeyword.trim() !== "") {
            // Navigasi ke halaman pencarian dengan query yang dimasukkan
            navigate(`/search?query=${encodeURIComponent(searchKeyword.trim())}`);
        }
    };

    return (
        <>
            <Navbar fixed="top" collapseOnSelect expand="lg" style={{ backgroundColor: "rgb(242, 234, 226)" }} className="shadow-sm">
                <Container fluid className="m-0">
                    {/* Brand Logo */}
                    <Navbar.Brand style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                        <div className="d-flex align-items-center">
                            <img src={logo} height="60" className="d-inline-block align-top" alt="Logo" />
                        </div>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="align-items-center w-100">
                            {/* Regular Menu Items */}
                            <div className="d-flex flex-grow-1">
                                {routes.slice(0, 4).map((route, index) => (
                                    <Nav.Link key={index} onClick={() => navigate(route.path)}>
                                        <Button
                                            variant="link"
                                            className={`hijau ${location.pathname === route.path ? "text-decoration-underline" : "text-decoration-none"}`}
                                        >
                                            {route.name}
                                        </Button>
                                    </Nav.Link>
                                ))}
                            </div>

                            {/* Search Bar */}
                            <Form className="d-flex mx-lg-3 my-2 my-lg-0 position-relative" style={{ minWidth: "300px" }} onSubmit={handleSearchSubmit}>
                                <Form.Control
                                    type="search"
                                    placeholder="Search products here"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    className="pe-5"
                                    aria-label="Search"
                                    style={{
                                        paddingRight: '2.5rem',
                                        borderColor: 'rgba(83, 83, 83, 1)',
                                        borderRadius: '20px',
                                    }}
                                />
                                <Button
                                    type="submit"
                                    variant="link"
                                    className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0"
                                    style={{
                                        transform: 'translateY(-50%)',
                                        color: 'rgba(4, 121, 2, 1)',
                                        padding: '0.375rem 0.75rem'
                                    }}
                                >
                                    <FaSearch />
                                </Button>
                            </Form>

                            {/* Icons (Cart and Person) */}
                            <div className="d-flex">
                                {routes.slice(4).map((route, index) => (
                                    <Nav.Link key={`icon-${index}`} onClick={() => navigate(route.path)} className="ms-2">
                                        {route.name}
                                    </Nav.Link>
                                ))}
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default TopNavbar;
