import { Form, FloatingLabel } from "react-bootstrap";

const InputFloatingForm = (props) => {
  return (
    <div className="mb-3">
      <h5 className="abu83">{props.label}</h5>
    <Form.Group className="mb-3" controlId={props.name}>
      {/* <FloatingLabel className="" label={props.label}> */}
        <Form.Control
          className="border-secondary"
          placeholder={props.placeholder }
          {...props} 
        />
      {/* </FloatingLabel>  */}
    </Form.Group>
    </div>
  );
};

export default InputFloatingForm;
