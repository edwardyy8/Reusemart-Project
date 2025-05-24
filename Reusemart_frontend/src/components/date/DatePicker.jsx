import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button } from "react-bootstrap";

const Datepicker = ({ onConfirm, minDate  }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (onConfirm && selectedDate) {
      onConfirm(selectedDate);
    }
    setShowConfirm(false);
  };

  return (
    <>
      <DatePicker
        inline
        onChange={handleDateChange}
        placeholderText="Pilih tanggal pengiriman"
        dateFormat="yyyy-MM-dd"
        className="form-control"
        minDate={minDate}
      />

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Tanggal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin memilih tanggal{" "}
          {selectedDate && selectedDate.toLocaleDateString()}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Batal
          </Button>
          <Button className="btnHijau" onClick={handleConfirm}>
            Yakin
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Datepicker;
