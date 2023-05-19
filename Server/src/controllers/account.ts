import crypto from "@/common/crypto.js";
import {
  createUser,
  verifyUser,
  findUserById,
  updateUserInfoById,
  findUserInfo,
  updatePasswordById,
} from "@/models";
import { Http_code } from "@/constants";
// 注册
export const register = async (req, res) => {
  const { userName, password, eMail } = req.body?.data;
  const hasUser = await findUserInfo({ userName });
  if (hasUser) {
    return res.json(Http_code.SUCCESS, { code: 0, message: "该账号名已存在" });
  }
  const userInfo = await createUser({ userName, password, eMail });
  if (userInfo) {
    res.json(Http_code.SUCCESS, { code: 1, message: "账号创建成功" });
  } else {
    res.json(Http_code.SUCCESS, { code: 0, message: "账号创建失败" });
  }
};
// 登录
export const login = async (req, res) => {
  const isLegitimateAccount = await verifyUser(req.body.data);
  if (isLegitimateAccount) {
    res.json(Http_code.SUCCESS, {
      token: crypto.encrypt(isLegitimateAccount._id.toString()),
      code: 1,
      message: "ok",
    });
  } else {
    res.json(Http_code.SUCCESS, { code: 0, message: "账户或密码错误" });
  }
};
// 查询用户信息
export const getUserInfo = async (req, res) => {
  const userId = crypto.decrypt(req.headers.authorization);
  const userInfo = await findUserById(userId);
  if (userInfo) {
    res.json(Http_code.SUCCESS, {
      code: 1,
      userName: userInfo.userName,
      eMail: userInfo.eMail,
    });
  } else {
    res.json(Http_code.SUCCESS, { code: 0, message: "账户不存在" });
  }
};
// 更新密码
export const updatePassword = async (req, res) => {
  const { userName, password, eMail } = req.body?.data;
  const userInfo = await findUserInfo({ userName, eMail });
  if (userInfo) {
    userInfo.password = password;
    const saveUserInfo = await updatePasswordById(userInfo);
    if (saveUserInfo) {
      res.json({ code: 1, message: "修改密码成功！" });
    }
  } else {
    res.json({ code: 0, message: "账户或邮箱错误" });
  }
};
// 更新用户信息
export const updateUserMessage = async (req, res) => {
  const { data } = req.body;
  const type = data.type;
  const userId = crypto.decrypt(req.headers.authorization);
  const value = data.value;
  data.password = crypto.md5(crypto.md5(data.password));
  const userInfo = await findUserInfo({ _id: userId, password: data.password });
  if (userInfo) {
    userInfo[type] = value;
    if (type === "userName") {
      const hasDoubleName = await findUserInfo({ userName: data.value });
      if (hasDoubleName) {
        res.json(Http_code.SUCCESS, { code: 0, message: "该账户名已存在" });
      } else {
        const saveUserInfo = await updateUserInfoById(userInfo);
        if (saveUserInfo) {
          res.json(Http_code.SUCCESS, { code: 1, message: "修改用户名成功！" });
        }
      }
    } else if (type === "password") {
      const savePassword = updatePasswordById(userInfo);
      if (savePassword) {
        res.json(Http_code.SUCCESS, { code: 1, message: "修改密码成功！" });
      }
    } else if (type === "eMail") {
      const hasDoubleEmail = await findUserInfo({ eMail: data.value });
      if (hasDoubleEmail) {
        res.json(Http_code.SUCCESS, { code: 0, message: "该邮箱已存在" });
      } else {
        const saveUserInfo = await updateUserInfoById(userInfo);
        if (saveUserInfo) {
          res.json(Http_code.SUCCESS, { code: 1, message: "修改邮箱成功！" });
        }
      }
    }
  } else {
    res.json(Http_code.SUCCESS, { code: 0, message: "密码错误" });
  }
};
