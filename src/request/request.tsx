import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { showAlert } from "../components/AlertModel/Alert";

/**
 * 創建axios實例
 */
const ENV = process.env.NODE_ENV;
const host =
  ENV === "development" ? "http://127.0.0.1:4000" : "http://35.77.212.217:4000";
const service = axios.create({
  baseURL: host,
  timeout: 3000,
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
service.interceptors.response.use((res: AxiosResponse<any>) => {
  console.log(res);
  const { code, data, message } = res.data;
  if (code == 0) {
    if (res.data.data) {
      res.data.data = backToFront(res.data.data);
    }

    message &&
      showAlert({
        type: "success" as const,
        message: `成功: ${message}`,
        show: true,
      });
  } else {
    showAlert({
      type: "danger" as const,
      message: `失敗: ${res.data.message}`,
      show: true,
    });
    console.log(message);
  }
  return res.data;
});

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
