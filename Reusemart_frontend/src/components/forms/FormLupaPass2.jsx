import { Button, Alert, Spinner, Form, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import InputFloatingForm from "./InputFloatingForm";

// import { SignUp } from "../../api/apiAuth";

const FormLupaPass2 = () => {
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

  const Login = (event) => {
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
    <Container className="mt-4 mb-5 p-5 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
      <Form style={{ maxWidth: "600px", margin: "auto" }} onSubmit={Login}>
        <Row className="g-5">
          <Col>
            <InputFloatingForm
              type="password"
              label="Kata sandi baru"
              name="password"
              onChange={handleChange}
              placeholder="Masukkan kata sandi baru"
              required
            />

            <p className="text-start mt-2 abuForm">
                Mohon masukkan password baru anda, lalu tekan tombol konfirmasi.
            </p>

            <div className="text-center">
                <Button
                    type="submit"
                    className="mt-3 border-0 buttonSubmit btn-lg rounded-5 shadow-sm"
                    style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
                    >
                    KONFIRMASI
                </Button>
            </div>
            

            <p className="text-center mt-3 mb-0 abuForm">
              Ingat Kata Sandi? <Link to="/login">Login!</Link>
            </p>

          </Col>
  
        </Row>
      </Form>
    </Container>
  );
};

export default FormLupaPass2;
