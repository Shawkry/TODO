/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-04-27 09:59:27
 * ⭐ @LastEditTime: 2022-04-27 13:01:26
 * ⭐ @Description: crypto AES加密解密
 */
import * as crypto from "crypto-js";
const key = "abeoietlt32fai12_!293";
export const encrypt = (data: object) => {
  return data;
  // return crypto.AES.encrypt(JSON.stringify(data), key).toString();
};
export const decrypt = (ciphertext: string) => {
  return ciphertext;
  // const bytes = crypto.AES.decrypt(ciphertext, key);
  // const decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8));
  // return decryptedData;
};
