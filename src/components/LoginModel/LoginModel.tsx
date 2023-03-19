import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

interface UserProps {
  openUser: boolean;
  setOpenUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const User = (props: UserProps) => {
  /**
   * 状態定義
   */
  const handleClose = () => props.setOpenUser(false);

  return (
    <>
      <Modal
        show={props.openUser}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>祝福</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>悄悄話 comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="在這裡先祝福大家金兔祈福，闔家幸福"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default User;
