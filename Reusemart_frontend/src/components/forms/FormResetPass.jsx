import { Button, Alert, Spinner, Form, Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import InputFloatingForm from "./InputFloatingForm";

import { resetPassword } from "../../api/apiAuth";

const FormResetPass = () => {
  const navigate = useNavigate();

  const { token } = useParams(); 
  const [searchParams] = useSearchParams(); 
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  

  const ResetPass = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsDisabled(true);
    resetPassword(token, email, password, passwordConfirmation)
      .then((res) => {
        setIsLoading(false);
        setIsDisabled(false);
        navigate("/login");
        toast.success(res.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  return (
    <Container className="mt-4 mb-5 p-5 rounded-3 w-50" style={{ border: '1px solid rgba(83, 83, 83, 1)', backgroundColor: 'rgba(241, 237, 233, 1)' }}>
      <Form style={{ maxWidth: "600px", margin: "auto" }} onSubmit={ResetPass}>
        <Row className="g-5">
          <Col>
            <InputFloatingForm
              type="email"
              label="Email"
              name="email"
              value={email}
              disabled={true}
            />

            <InputFloatingForm
              type="password"
              label="Kata sandi baru"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi baru"
              required
            />

            <InputFloatingForm
              type="password"
              label="Konfirmasi kata sandi baru"
              name="passwordConfirmation"
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Masukkan konfirmasi kata sandi baru"
              required
            />

            <p className="text-start mt-2 abuForm">
                Mohon masukkan password baru anda, lalu tekan tombol reset kata sandi.
            </p>

            <div className="text-center">
                <Button
                    type="submit"
                    className="mt-3 border-0 buttonSubmit btn-lg rounded-5 shadow-sm"
                    style={{ backgroundColor: "rgba(4, 121, 2, 1)" }}
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
                        <span>Reset Kata Sandi</span>
                    )}
                </Button>
            </div>

          </Col>
  
        </Row>
      </Form>
    </Container>
  );
};

export default FormResetPass;
