import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { commentApi, getCommentApi } from "../../request";
import { showAlert } from "../AlertModel/Alert";

interface WriteModelProps {
  openWrite: boolean;
  setOpenWrite: React.Dispatch<React.SetStateAction<boolean>>;
}

const WriteModel = (props: WriteModelProps) => {
  /**
   * 状態定義
   */
  //メッセージ
  const [comment, setComment] = useState<string>("");

  //ユーザーinfo
  const userInfo = {
    userName: localStorage.getItem("userName"),
    sqlNo: localStorage.getItem("sqlNo"),
  };

  /**
   * 関数定義
   */

  //表示非表示

  function handleClose(): void {
    props.setOpenWrite(false);
  }

  async function handleSumbit(): Promise<void> {
    if (userInfo.userName == null || userInfo.userName == "") {
      handleClose();
      showAlert({
        type: "warning" as const,
        message: `失敗:歹勢啦!好像還不知道您的大名耶 (ᗒᗣᗕ)՞ `,
        show: true,
      });
      return;
    }

    const param = {
      userName: userInfo.userName,
      sqlNo: userInfo.sqlNo,
      comment: comment,
    };

    let result = await commentApi(param);
    handleClose();
  }

  async function getComment(): Promise<void> {
    if (userInfo.sqlNo == null || userInfo.sqlNo == "") {
      return;
    }
    const param = { ...userInfo };
    let result = await getCommentApi(param);
    if (result) {
      result = { ...result };
      setComment(result[0].comment);
    }
  }
  /**
   * 監視定義
   */
  useEffect(() => {
    getComment();
  }, []);
  return (
    <>
      <Modal
        show={props.openWrite}
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
                maxLength={60}
                defaultValue={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSumbit}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WriteModel;
