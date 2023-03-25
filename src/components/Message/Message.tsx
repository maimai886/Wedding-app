import { createRoot } from "react-dom/client";
import { MessageModelData } from "./messageModel.interface";
import MessageModel from "./MessageModel";

const message = {
  dom: null,
  alert(messageData: MessageModelData) {
    // 创建一个dom
    let dom = document.createElement("div");
    // 定义组件，
    const JSXdom = <MessageModel messageData={messageData} show={true} />;

    // 渲染DOM
    createRoot(dom).render(JSXdom);
    // 置入到body节点下
    document.body.appendChild(dom);

    // 延迟1秒后移除DOM
    setTimeout(() => {
      document.body.removeChild(dom);
    }, 1000);
  },
};

export default message;
