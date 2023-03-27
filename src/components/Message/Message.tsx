import { createRoot } from "react-dom/client";
import { MessageModelData } from "./messageModel.interface";
import MessageModel from "./MessageModel";

const message = {
  dom: null,
  alert(messageData: MessageModelData) {
    // dom作成
    let dom = document.createElement("div");
    // component定義
    const JSXdom = <MessageModel messageData={messageData} show={true} />;

    // render
    createRoot(dom).render(JSXdom);
    // bodyに追加
    document.body.appendChild(dom);

    // 閉じる
    setTimeout(() => {
      document.body.removeChild(dom);
    }, 2000);
  },
};

export default message;
