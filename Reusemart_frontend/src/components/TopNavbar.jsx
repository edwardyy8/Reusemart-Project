import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Button, Form } from "react-bootstrap";
import logo from "../assets/images/logoreuse.png";
import { FaSearch } from 'react-icons/fa';
import Fuse from 'fuse.js';
import { GetAllBarangs } from "../api/apiBarang";

const TopNavbar = ({ routes }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [allBarangs, setAllBarangs] = useState([]);

    useEffect(() => {
        const fetchBarangs = async () => {
            try {
                const data = await GetAllBarangs();
                setAllBarangs(data);
            } catch (err) {
                console.error("Gagal mengambil barang:", err);
            }
        };
        fetchBarangs();
    }, []);


    const handleSearch = (e) => {
        e.preventDefault();
        const query = e.target.search.value.trim().toLowerCase();
        if (!query) return;

        const fuse = new Fuse(allBarangs, {
            keys: ["nama_barang"],
            threshold: 0.4,
        });

        const results = fuse.search(query);

        if (results.length > 0) {
            const suggestion = results[0].item.nama_barang;
            navigate(`/search?q=${encodeURIComponent(suggestion)}`);
        } else {
            alert("Barang tidak ditemukan.");
        }
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/");
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
                            <Form
                                className="d-flex mx-lg-3 my-2 my-lg-0 position-relative"
                                style={{ minWidth: "300px" }}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const query = e.target.search.value.trim().toLowerCase();
                                    if (!query) return;

                                    const fuse = new Fuse(allBarangs, {
                                        keys: ["nama_barang"],
                                        threshold: 0.4,
                                    });

                                    const results = fuse.search(query);

                                    if (results.length > 0) {
                                        const matchingNames = results.map((r) => r.item.nama_barang);
                                        const queryParam = encodeURIComponent(matchingNames.join(","));
                                        navigate(`/search?q=${queryParam}`);
                                    } else {
                                        alert("Barang tidak ditemukan.");
                                    }

                                }}

                            >
                                <Form.Control
                                    name="search"
                                    type="search"
                                    placeholder="Search products here"
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
