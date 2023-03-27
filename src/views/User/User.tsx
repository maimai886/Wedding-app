import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import message from "../../components/Message/Message";
import { AppContext } from "../../context/AppContext";
import useLoading from "../../hook/useLoading";
import { LoginApi } from "../../request";

interface UserProps {
  openUser: boolean;
  setOpenUser: React.Dispatch<React.SetStateAction<boolean>>;
}

const User = (props: UserProps) => {
  /**
   * 状態定義
   */
  //ユーザー名
  const [userName, setUserName] = useState<string>("");

  //useContextでユーザーINFO保存
  const { setUserInfo } = useContext(AppContext);

  //loadingModel
  const loading = useLoading();

  /**
   * 関数定義
   */

  //Model表示非表示
  function handleClose(): void {
    props.setOpenUser(false);
  }

  //sumbit処理
  async function handleLogin(): Promise<void> {
    if (userName == null || userName == "") {
      return;
    }
    const params = { userName: userName };
    let result = await LoginApi(params);
    if (result) {
      result = { ...result };
      localStorage.setItem("userName", result[0].userName);
      localStorage.setItem("sqlNo", result[0].sqlNo);
    }
    handleClose();
  }

  /**
   * 監視定義
   */

  //初期化
  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name);
    }
  }, []);

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
          <Modal.Title>歡迎您</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>請輸入大名</Form.Label>
              <Form.Control
                type="userName"
                placeholder="輸入名字後才可以上傳照片參加抽獎唷!"
                autoFocus
                onChange={(e) => setUserName(e.target.value)}
                maxLength={6}
                defaultValue={userName}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            先看看
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            開始
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default User;
