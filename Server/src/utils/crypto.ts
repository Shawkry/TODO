/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-04-25 16:54:36
 * ⭐ @LastEditTime: 2022-04-27 13:01:10
 * ⭐ @Description: 请填写简介
 */
import crypto from "crypto";
import cryptoJS from "crypto-js";
const key = "abeoietlt32fai12_!293";
export const encrypt = (data: string) => {
  return cryptoJS.AES.encrypt(data, key).toString();
};
export const decrypt = (ciphertext: string) => {
  let bytes = cryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(cryptoJS.enc.Utf8);
};
export const md5 = (data: string) => {
  const md5 = crypto.createHash("md5");
  return md5.update(data).digest("hex");
};
export default {
  encrypt,
  decrypt,
  md5,
};
