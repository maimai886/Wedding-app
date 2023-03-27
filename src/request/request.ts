import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import message from "../components/Message/Message";

/**
 * 創建axios實例
 */
const ENV = process.env.NODE_ENV;
const host =
  ENV === "development" ? "http://127.0.0.1:4000" : "http://35.77.212.217:4000";
const service = axios.create({
  baseURL: host,
  timeout: 10000,
});

interface ResType {
  [key: string]: any;
  code: number;
  message?: string;
  data?: Object;
}

/**
 * 請求攔截
 */

service.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: token,
    };
  }
  return config;
});

/**
 * response響應攔截
 */
service.interceptors.response.use(
  (res: AxiosResponse<any>) => {
    console.log(res);
    const { code } = res.data;
    if (code == 0) {
      if (res.data.data) {
        res.data.data = backToFront(res.data.data);
      }
      res.data.message &&
        message.alert({
          type: "success",
          message: `成功: ${res.data.message}`,
        });
    } else {
      res.data.message &&
        message.alert({ type: "danger", message: `失敗: ${res.data.message}` });
      console.log(res.data.message);
    }
    return res.data;
  },
  (error) => {
    // Handle request failure
    console.log(error);
    message.alert({ type: "danger", message: `連線失敗請向服務器確認` });
    return Promise.resolve(error.response); // 返回一个 resolved 状态的 Promise
  }
);

/**
 * request封裝請求函數
 */
const request = (options: AxiosRequestConfig<any>) => {
  if (options.method === "get") {
    options.params = options.data;
  }
  return service(options);
};

//対象名＿から大文字変える処理
function backToFront(params: ResType) {
  if (typeof params === "object") {
    for (let key in params) {
      let newKey = key;
      if (key.includes("_")) {
        newKey = key.replaceAll(/_([a-zA-Z])/g, (match, p1) =>
          p1.toUpperCase()
        );
      }
      if (newKey !== key) {
        params[newKey] = params[key];
        delete params[key];
      }
      if (typeof params[newKey] === "object") {
        params[newKey] = backToFront(params[newKey]);
      }
    }
  }
  return params;
}

export default request;
