import { Button, Alert, Spinner, Form, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import InputFloatingForm from "./InputFloatingForm";

// import { SignUp } from "../../api/apiAuth";

const FormRegister = () => {
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(true);
  const [data, setData] = useState({
    name: "",
    handle: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleCheck = (e) => {
    let isChecked = e.target.checked;
    if (isChecked) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const Register = (event) => {
    event.preventDefault();
    SignUp(data)
      .then((res) => {
        navigate("/");
        toast.success(res.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  return (
    <Container className="mt-4 mb-5 py-4 rounded-3 w-75" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
      <Form style={{ maxWidth: "800px", margin: "auto" }} onSubmit={Register}>
        <Row className="g-5">
          <Col md={6}>
            <InputFloatingForm
              type="text"
              label="Username"
              name="username"
              onChange={handleChange}
              placeholder="Masukkan Username"
            />
            
            <InputFloatingForm
              type="file"
              label="Foto Profile"
              name="foto_profile"
              onChange={handleChange}
            />
  
            <Form.Group className="mb-3">
              <Form.Label className="abu83 h5">Role</Form.Label>
              <Form.Select name="role" onChange={handleChange}>
                <option value="">Pilih Role</option>
                <option value="pembeli">Pembeli</option>
                <option value="organisasi">Organisasi</option>
              </Form.Select>
            </Form.Group>
  
            <InputFloatingForm
              type="email"
              label="Email"
              name="email"
              onChange={handleChange}
              placeholder="Masukkan Email"
            />
  
            <InputFloatingForm
              type="password"
              label="Kata Sandi"
              name="password"
              onChange={handleChange}
              placeholder="Masukkan Password"
              autoComplete="off"
            />
  
            <InputFloatingForm
              type="password"
              label="Konfirmasi Kata Sandi"
              name="confirm_password"
              onChange={handleChange}
              placeholder="Konfirmasi Password"
              autoComplete="off"
            />
          </Col>
  
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="abu83 h5">Alamat Lengkap</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="alamat" 
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap"
              />
            </Form.Group>
  
            <InputFloatingForm
              type="text"
              label="Label Alamat"
              name="label_alamat"
              onChange={handleChange}
              placeholder="Contoh: Rumah, Kantor"
            />
  
            <InputFloatingForm
              type="tel"
              label="Nomor HP"
              name="no_hp"
              onChange={handleChange}
              placeholder="Masukkan nomor handphone"
            />
            
            <div className="mt-4 pt-2"> 
              <label className="d-flex justify-content-start">
                <Form.Check type="checkbox" onChange={handleCheck} />
                <p className="ms-2 abu83">
                  Saya telah membaca{" "}
                  <a href="">Ketentuan Layanan</a>
                </p>
              </label>
  
              <Button
                disabled={isDisabled}
                type="submit"
                className="mt-3 w-100 border-0 buttonSubmit btn-lg rounded-5"
                style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
              >
                Daftar
              </Button>
  
              <p className="text-center mt-2 abu83">
                Sudah memiliki akun? <Link to="/login">Klik Disini!</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default FormRegister;
