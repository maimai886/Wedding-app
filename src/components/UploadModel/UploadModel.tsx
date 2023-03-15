import React, { ChangeEvent, useRef, useState } from "react";
import style from "./upload.module.scss";
import { ReactComponent as Plus } from "../../assets/svgs/plusMark.svg";
import { ReactComponent as Cancle } from "../../assets/svgs/cancleMark.svg";
import Offcanvas from "react-bootstrap/Offcanvas";
import { UploadFile } from "./uploadModel.interface";
import moment from "moment";
import { Button } from "react-bootstrap";

interface WriteModelProps {
  openUpload: boolean;
  setOpenUpload: React.Dispatch<React.SetStateAction<boolean>>;
  multiple?: boolean;
}

const WriteModel = (props: WriteModelProps) => {
  /**
   * 状態定義
   */
  const handleClose = () => {
    props.setOpenUpload(false);
    handelClear();
  };

  //ファイルデータ
  const fileInput = useRef<HTMLInputElement>(null);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [imgFile, setImgFile] = useState<File[]>([]);

  const [fileSrc, setFileSrc] = useState<any>(null);

  /**
   * 関数定義
   */
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
  function handleUpload(): void {
    console.log("file", imgFile);
  }
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
                  <>
                    <Cancle className={style.cancle} onClick={handelClear} />
                    <img src={fileSrc} className={style.imgPre} />
                    <span className={style.uploadText}>{item.name}</span>
                  </>
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
