import { Button, Alert, Spinner, Form, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import InputFloatingForm from "./InputFloatingForm";

import { forgotPassword } from "../../api/apiAuth";

const FormLupaPass = () => {
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
 
  const [email, setEmail] = useState("");
  const [user_type, setUserType] = useState("");

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

  const ForgotPass = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsDisabled(true);
    forgotPassword(email, user_type)
      .then((res) => {
        toast.success(res.message);
        setIsLoading(false);
        setIsDisabled(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
        setIsLoading(false);
        setIsDisabled(false);
      });
  };

  return (
    <Container className="mt-4 mb-5 p-5 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
      <Form style={{ maxWidth: "600px", margin: "auto" }} onSubmit={ForgotPass}>
        <Row className="g-5">
          <Col>
            <InputFloatingForm
              type="email"
              label="Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan Email"
              required
            />

            <Form.Group className="mb-3 " >
              <Form.Label className="abu83 h5">Role</Form.Label>
              <Form.Select className="border-dark abu83" name="userType" onChange={(e) => setUserType(e.target.value)} required>
                <option value="">Pilih Role</option>
                <option value="pembeli">Pembeli</option>
                <option value="organisasi">Organisasi</option>
                <option value="penitip">Penitip</option>
              </Form.Select>
            </Form.Group>


            <p className="text-start mt-2 abuForm">
                Masukkan email anda dan kami akan mengirimkan link verifikasi ke email tersebut.
            </p>

            <div className="text-center">
                <Button
                    type="submit"
                    className="mt-3 border-0 buttonSubmit btn-lg rounded-5 shadow-sm"
                    style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
                    disabled={isDisabled}
                    >
                    {isLoading ? (
                      <>
                          <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          />{" "}
                          Loading...
                      </>
                    ) : (
                        <span>KONFIRMASI</span>
                    )}
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

export default FormLupaPass;
