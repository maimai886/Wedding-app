import React, { useState } from "react";
import style from "./upload.module.scss";
import { ReactComponent as Plus } from "../../assets/svgs/plusMark.svg";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Offcanvas from "react-bootstrap/Offcanvas";

interface WriteModelProps {
  openUpload: boolean;
  setOpenUpload: React.Dispatch<React.SetStateAction<boolean>>;
}

const WriteModel = (props: WriteModelProps) => {
  /**
   * 状態定義
   */
  const handleClose = () => props.setOpenUpload(false);

  return (
    <>
      {
        // <Modal
        //   show={props.openUpload}
        //   onHide={handleClose}
        //   size="lg"
        //   aria-labelledby="contained-modal-title-vcenter"
        //   centered
        // >
        //   <Modal.Header closeButton>
        //     <Modal.Title>選擇圖片 select</Modal.Title>
        //   </Modal.Header>
        //   <Modal.Body>
        //     <Form>
        //       <Form.Group
        //         className="mb-3"
        //         controlId="exampleForm.ControlTextarea1"
        //       >
        //         <Form.Label>
        //           <label className={style.btnUpload}>
        //             <input
        //               id="upload_img"
        //               style={{ display: "none" }}
        //               type="file"
        //             />
        //             <i className="fa fa-photo"></i> 上傳圖片
        //           </label>
        //         </Form.Label>
        //       </Form.Group>
        //     </Form>
        //   </Modal.Body>
        //   <Modal.Footer>
        //     <Button variant="secondary" onClick={handleClose}>
        //       Close
        //     </Button>
        //     <Button variant="primary" onClick={handleClose}>
        //       上傳
        //     </Button>
        //   </Modal.Footer>
        // </Modal>

        <Offcanvas
          show={props.openUpload}
          onHide={handleClose}
          placement={"bottom"}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>選擇圖片 select</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <label className={style.btnUpload}>
              <input id="upload_img" style={{ display: "none" }} type="file" />
              <Plus className={style.plusIcon}/>
              上傳圖片
            </label>
          </Offcanvas.Body>
        </Offcanvas>
      }
    </>
  );
};

export default WriteModel;
