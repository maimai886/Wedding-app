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
 * getCommentAoi
 */

export const getCommentApi = async (data: any) => {
  const response = await request({
    method: "post",
    url: "/api/v1/user/getComment",
    data,
  });
  return response.data;
};

/**
 * getFileListApi
 */

export const getFileListApi = async (data: any) => {
  const response = await request({
    method: "post",
    url: "/api/v1/user/getFileList",
    data,
  });
  return response.data;
};

/**
 * ファイルアップロード
 */
export const uploadApi = async (file: File, fileName: string, data: any) => {
  const formData = new FormData();
  formData.append("file", file, fileName);
  formData.append("data", JSON.stringify(data));

  console.log(formData, "formData");
  const response = await request({
    method: "post",
    url: "/api/v1/user/upload",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
