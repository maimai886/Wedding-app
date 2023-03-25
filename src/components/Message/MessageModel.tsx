import style from "./messageModel.module.scss";
import { ReactComponent as Error } from "../../assets/svgs/errorMark.svg";
import { ReactComponent as Check } from "../../assets/svgs/checkMark.svg";
import Alert from "react-bootstrap/Alert";
import { useEffect, useState } from "react";
import { MessageModelData } from "./messageModel.interface";

interface messageModelProps {
  messageData: MessageModelData;
  children?: React.ReactNode;
  show: boolean;
}

const MessageModel = (props: messageModelProps) => {
  /**
   * 状態定義
   */
  const [showAlert, setShowAlert] = useState<boolean>(true);

  /**
   * 監視定義
   */
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showAlert, props]);

  return (
    <>
      {showAlert && (
        <div className={style.main}>
          {
            <Alert
              variant={props.messageData.type}
              className={style.messageBox}
            >
              <span className={style.iconStyle}>
                {
                  (props.messageData.type && "danger" && <Error />,
                  props.messageData.type && "success" && <Check />)
                }
              </span>
              {props.messageData.message}
            </Alert>
          }
        </div>
      )}
    </>
  );
};

export default MessageModel;
