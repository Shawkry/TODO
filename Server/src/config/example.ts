/* 启用项目前需要将该文件的文件名修改成index.ts */
export const CONFIG = {
  // 服务器配置
  SERVER: {
    host: "localhost", // 服务器的ip地址
    port: 1314, // 服务器的端口号
  },
  // 数据库配置
  DB: {
    host: "localhost",
    user: "xxx", // MongoDB数据库的用户名
    password: "xxx", // MongoDB数据库的密码
  },
  // session配置
  SESSION_CONFIG: {
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
    maxAge: 10,
  },
  // https配置,需要将https证书放在config/https文件夹下
  HTTPS_FILES_PATH: {
    key: "./src/config/https/xxx.key",
    cert: "./src/config/https/xxx.pem",
  },
};
