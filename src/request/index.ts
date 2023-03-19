import request from "./request";

/**
 * 登録
 */

export const LoginApi = async (data: any) => {
  const response = await request({
    method: "post",
    url: "/api/v1/user/login",
    data,
  });
  return response.data;
};

/**
 * メッセージ
 */

export const commentApi = async (data: any) => {
  const response = await request({
    method: "post",
    url: "/api/v1/user/comment",
    data,
  });
  return response.data;
};

/**
 * アイテム
 */

export const itemApi = async (data: any) => {
  const response = await request({
    method: "post",
    url: "/api/v1/user/item",
    data,
  });
  return response.data;
};
