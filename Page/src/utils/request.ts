/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-04 10:51:41
 * ⭐ @LastEditTime: 2022-04-27 10:40:43
 * ⭐ @Description: axios请求函数库
 */
import axios from "axios";
import type { IRespond } from "@/types";
// import process from "process";
let baseURL = "";
switch (process.env.NODE_ENV) {
  case "production":
    baseURL = import.meta.env.VITE_PRODUCTION_BASE_API;
    break;
  case "development":
    baseURL = import.meta.env.VITE_DEVELOPMENT_BASE_API;
}
const service = axios.create({
  timeout: 8000, // 请求超时时间
  baseURL: baseURL,
});
service.interceptors.request.use((config: any) => {
  if (localStorage.getItem("user_token")) {
    config.headers.Authorization = localStorage.getItem("user_token");
  }
  return config;
});
const request = {
  post(url: string, params: object): Promise<IRespond | null> {
    return new Promise((resolve, reject) => {
      service({
        method: "post",
        url: url,
        data: { data: params },
      })
        .then((res) => {
          res ? resolve(res.data) : null;
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  get(url: string, params: object): Promise<IRespond | null> {
    return new Promise((resolve, reject) => {
      service({
        method: "get",
        url: url,
        data: { data: params },
      })
        .then((res) => {
          res ? resolve(res.data) : null;
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
export default request;
