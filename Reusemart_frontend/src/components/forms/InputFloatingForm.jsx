import { Form, FloatingLabel } from "react-bootstrap";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const InputFloatingForm = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === "password";

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="mb-3">
      <h5 className="abu83">{props.label}</h5>
      <Form.Group className="mb-3" controlId={props.name}>
        <div style={{ position: "relative" }}>
          <Form.Control
            className="border-secondary pe-5"
            type={isPassword ? (showPassword ? "text" : "password") : props.type}
            placeholder={props.placeholder }
            name={props.name}
            onChange={props.onChange}
            autoComplete={props.autoComplete}
            required={props.required}
            disabled={props.disabled}

            // {...props} 
          />
          {isPassword && (
            <span
              onClick={togglePassword}
              className="position-absolute top-50 translate-middle-y end-0 me-3 hijau"
              style={{
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              {showPassword ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
            </span>
          )}
        </div>
      </Form.Group>
      
    </div>
  );
};

export default InputFloatingForm;
