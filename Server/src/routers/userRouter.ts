import express from "express";
import {
  register,
  login,
  getUserInfo,
  updatePassword,
  updateUserInfo,
} from "@/controllers";
const userRouter = express.Router();
/* 注册账号 */
userRouter.post("/register", register);
/* 登录账号 */
userRouter.post("/login", login);
/* 用户信息查询 */
userRouter.post("/info", getUserInfo);
/* 找回用户密码 */
userRouter.post("/updatePassword", updatePassword);
/* 修改用户信息 */
userRouter.post("/updateInfo", updateUserInfo);

export default userRouter;
