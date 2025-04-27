import { Button, Alert, Spinner, Form, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import InputFloatingForm from "./InputFloatingForm";

import { SignIn } from "../../api/apiAuth";


const FormLogin = () => {
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(true);

  const [data, setData] = useState({
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

  const Login = (event) => {
    event.preventDefault();
    SignIn(data)
      .then((res) => {
        sessionStorage.setItem("token", res.token);
        
        navigate(0);

        // toast.success(res.message); 
        // if(res.user_type === "pegawai") {
        //   console.log(res.jabatan);
        //   navigate(`/${res.user_type}/${res.jabatan}`);
        // }else{
        //   navigate(`/${res.user_type}`);
        // }
        
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  return (
    <Container className="mt-4 mb-5 p-5 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
      <Form style={{ maxWidth: "800px", margin: "auto" }} onSubmit={Login}>
        <Row className="g-5">
          <Col>
            <InputFloatingForm
              type="email"
              label="Email"
              name="email"
              onChange={handleChange}
              placeholder="Masukkan Email"
              required
            />
  
            <InputFloatingForm
              type="password"
              label="Kata Sandi"
              name="password"
              onChange={handleChange}
              placeholder="Masukkan Password"
              autoComplete="off"
              required
            />    

            <p className="text-start mt-2 abuForm">
              Lupa Pasword? <Link to="/lupapassword">Klik disini!</Link>
            </p>

            <div className="text-center">
              <Button
                type="submit"
                className="mb-3 border-0 buttonSubmit btn-lg rounded-5 shadow-sm"
                style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
              >
                LOGIN
              </Button>
            </div>

            <p className="text-center mb-0 abuForm">
              Belum memiliki akun? <Link to="/register">Register!</Link>
            </p>

          </Col>
  
        </Row>
      </Form>
    </Container>
  );
};

export default FormLogin;
