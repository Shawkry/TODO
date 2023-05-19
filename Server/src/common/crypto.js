/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-04-25 16:54:36
 * ⭐ @LastEditTime: 2022-04-27 13:01:10
 * ⭐ @Description: 请填写简介
 */
const cryptoJS = require("crypto-js");
const crypto = require("crypto");
const key = "abeoietlt32fai12_!293";
const encrypt = (data) => {
  return cryptoJS.AES.encrypt(data, key).toString();
};

const decrypt = (ciphertext) => {
  let bytes = cryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(cryptoJS.enc.Utf8);
};
const md5 = (data) => {
  const md5 = crypto.createHash("md5");
  return md5.update(data).digest("hex");
};

module.exports = {
  encrypt,
  decrypt,
  md5,
};
