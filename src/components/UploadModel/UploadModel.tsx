import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import style from "./upload.module.scss";
import { ReactComponent as Plus } from "../../assets/svgs/plusMark.svg";
import { ReactComponent as Cancle } from "../../assets/svgs/cancleMark.svg";
import Offcanvas from "react-bootstrap/Offcanvas";
import moment from "moment";
import { Button } from "react-bootstrap";
import { uploadApi, getFileListApi } from "../../request";
import message from "../Message/Message";
import useLoading from "../../hook/useLoading";

interface WriteModelProps {
  openUpload: boolean;
  setOpenUpload: React.Dispatch<React.SetStateAction<boolean>>;
  setFileList: any;
  multiple?: boolean;
  handleMenu: Function;
}

const WriteModel = (props: WriteModelProps) => {
  /**
   * 状態定義
   */
  //ユーザーinfo
  const userInfo = {
    userName: localStorage.getItem("userName"),
    sqlNo: localStorage.getItem("sqlNo"),
  };

  //loadingModel
  const loading = useLoading();

  //ファイルデータ
  const fileInput = useRef<HTMLInputElement>(null);

  const [imgFile, setImgFile] = useState<File[]>([]);

  const [fileSrc, setFileSrc] = useState<any>(null);

  //ファイル名
  const [fileName, setFileName] = useState<string>(
    moment().format("YYYYMMDDHHmmssSSS")
  );

  /**
   * 関数定義
   */
  //閉じる処理
  const handleClose = () => {
    props.setOpenUpload(false);
    handelClear();
  };

  //ファイルアップロード
  function handleFileChange(e: ChangeEvent<HTMLInputElement>): void {
    const files = e.target.files;
    if (!files) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      setFileSrc(reader.result);
    };
    reader?.readAsDataURL(files[0]);

    const filesArray = Array.from(files);

    setImgFile(filesArray);
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  }
  //ファイル削除
  function handelClear(): void {
    setFileSrc(null);
    setImgFile([]);
  }

  //コミット
  async function handleUpload(): Promise<void> {
    handleClose();

    //認証失敗
    if (userInfo.userName == null || userInfo.userName == "") {
      handleClose();
      message.alert({
        type: "warning" as const,
        message: `失敗:歹勢啦!好像還不知道您的大名耶 (ᗒᗣᗕ)՞ `,
      });
      return;
    }

    loading.open();
    //続き
    const param = {
      userName: userInfo.userName,
      sqlNo: userInfo.sqlNo,
      fileName: fileName,
    };

    const result = await uploadApi(imgFile[0], fileName, param);
    if (result?.code == 0) {
      props.handleMenu();
    }
    loading.close();
  }

  //filelist取得
  async function getFileList(): Promise<void> {
    if (userInfo.sqlNo == null || userInfo.sqlNo == "") {
      return;
    }
    const param = { ...userInfo };
    let result = await getFileListApi(param);
    if (result.code == 0) {
      props.setFileList(result.fileList);
    }
  }
  /**
   * 監視定義
   */
  useEffect(() => {
    getFileList();
  }, []);

  return (
    <>
      <Offcanvas
        className={style.uploadCustom}
        show={props.openUpload}
        onHide={handleClose}
        placement={"bottom"}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className={style.uploadTitle}>
            選擇圖片 select
            <Button disabled={!fileSrc} onClick={handleUpload}>
              上傳
            </Button>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={style.uploadBody}>
          {fileSrc ? (
            <>
              {imgFile.map((item, index) => {
                return (
                  <div className={style.uploadBody}>
                    <Cancle className={style.cancle} onClick={handelClear} />
                    <img src={fileSrc} className={style.imgPre} />
                    <div className={style.uploadBox}>
                      <div className={style.uploadBoxTitle}>幫照片取個名字</div>
                      <input
                        className={style.uploadText}
                        placeholder={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        maxLength={20}
                      />
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              <label className={style.uploadBtn}>
                <input
                  id="upload_img"
                  accept="image/*"
                  style={{ display: "none" }}
                  type="file"
                  ref={fileInput}
                  onChange={handleFileChange}
                  multiple={props.multiple ?? false}
                />
                <Plus className={style.plusIcon} />
              </label>
              <span className={style.uploadText}>上傳圖片 Upload</span>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default WriteModel;
