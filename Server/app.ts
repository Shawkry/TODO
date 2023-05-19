/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-08 00:05:02
 * ⭐ @LastEditTime: 2022-04-09 21:01:56
 * ⭐ @Description: 请填写简介
 */

import express from "express";
import fs from "fs";
import https from "https";
import http from "http";
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import history from "connect-history-api-fallback";
import { router } from "@/routers";
import { CONFIG } from "src/config";
const { SESSION_CONFIG, HTTPS_FILES_PATH } = CONFIG;
const httpsOption = {
  key: fs.readFileSync(HTTPS_FILES_PATH.key),
  cert: fs.readFileSync(HTTPS_FILES_PATH.cert),
};

const app = express();
app.use("/public/", express.static(path.join(__dirname, "./public/")));
app.use(
  "/node_modules/",
  express.static(path.join(__dirname, "./node_modules"))
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session(SESSION_CONFIG));
app.use(express.static(path.join(__dirname, "./dist")));
app.use(history());

app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type,Authorization");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == "options")
    res.send(200); //让options尝试请求快速结束
  else next();
});

app.use(router);
http.createServer(app).listen(2000);
https.createServer(httpsOption, app).listen(4000, function () {
  console.log("httpPort:2000  httpsPort:4000");
  console.log("Server running...");
});
