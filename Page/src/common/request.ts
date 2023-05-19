/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-04 10:51:41
 * ⭐ @LastEditTime: 2022-04-27 10:40:43
 * ⭐ @Description: axios请求函数库
 */
import axios from "axios";
import * as aes from "./crypto"
let baseURL = '';
switch (process.env.NODE_ENV) {
    case 'production':
        baseURL = 'https://shawry14.top:4000/';
        break;
    case 'development':
        baseURL = 'http://localhost:2000/';
}
const service = axios.create({
    timeout: 8000, // 请求超时时间
    baseURL: baseURL,
});
service.interceptors.request.use(
    (config: any) => {
        if (localStorage.getItem('user_token')) {
            config.headers.Authorization = localStorage.getItem('user_token');
        }
        return config;
    },
);
const request = {
    post(url: string, parmas: object) {
        return new Promise((resolve, reject) => {
            service({
                method: 'post',
                url: url,
                data: {data:aes.encrypt(parmas)},
            })
                .then(res => {
                    res ? resolve(aes.decrypt(res.data)) : null;
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    get(url: string, parmas: object) {
        return new Promise((resolve, reject) => {
            service({
                method: 'get',
                url: url,
                data: {data:aes.encrypt(parmas)},
            })
                .then(res => {
                    res ? resolve(aes.decrypt(res.data)): null;
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

}
export default request;