/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-08 00:05:02
 * ⭐ @LastEditTime: 2022-04-09 21:01:56
 * ⭐ @Description: 请填写简介
 */
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import fs from "fs";
import https from "https";
import http from "http";
import path from "path";
import bodyParser from "body-parser";
import session from "express-session";
import history from "connect-history-api-fallback";
import router from "@/routers";
import { SESSION_CONFIG } from "@/constants/session_config";
const app = express();

// app.use("/public/", express.static(path.join(__dirname, "./public/")));
// app.use(
//   "/node_modules/",
//   express.static(path.join(__dirname, "./node_modules")),
// );
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session(SESSION_CONFIG));
app.use(history());
app.use(
  cors({
    origin: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["DELETE", "PUT", "POST", "GET", "OPTIONS"],
  }),
);
app.all("*", function (req, res, next) {
  if (req.method.toLowerCase() == "options")
    res.send(200); //让options尝试请求快速结束
  else next();
});

app.use(router);
http.createServer(app).listen(process.env.SERVER_HTTP_HOST, () => {
  console.log(`http port:${process.env.SERVER_HTTP_HOST}`);
  console.log("Server running...");
});
if (process.env.NODE_ENV === "production" && process.env.OPEN_HTTPS) {
  const httpsOption = {
    key: fs.readFileSync(process.env.HTTPS_KEY_FILES_PATH, "utf8"),
    cert: fs.readFileSync(process.env.HTTPS_CERT_FILES_PATH, "utf8"),
  };
  https
    .createServer(httpsOption, app)
    .listen(process.env.SERVER_HTTPS_HOST, () => {
      console.log(`https port:${process.env.SERVER_HTTPS_HOST}`);
      console.log("Server Running...");
    });
}
