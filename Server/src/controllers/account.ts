import crypto from "@/utils/crypto";
import {
  createUser,
  verifyUser,
  findUserById,
  updateUserInfoById,
  findUserInfo,
  updatePasswordById,
} from "@/models";
import { CODE, Http_CODE } from "@/constants/http_code";
import type { IRequest, IRespond, IUserInfo } from "@/types";
// 注册
export const register = async (
  req: IRequest<{ userName: string; password: string; eMail: string }>,
  res: IRespond<{}>,
) => {
  const { userName, password, eMail } = req.body?.data;
  const hasUser = await findUserInfo({ userName });
  if (hasUser) {
    return res
      .status(Http_CODE.SUCCESS)
      .json({ code: CODE.ERROR, message: "该账号名已存在" });
  }
  const userInfo = await createUser({ userName, password, eMail });
  if (userInfo) {
    res
      .status(Http_CODE.SUCCESS)
      .json({ code: CODE.SUCCESS, message: "账号创建成功" });
  } else {
    res
      .status(Http_CODE.SUCCESS)
      .json({ code: CODE.ERROR, message: "账号创建失败" });
  }
};
// 登录
export const login = async (
  req: IRequest<IUserInfo>,
  res: IRespond<string>,
) => {
  const isLegitimateAccount = await verifyUser(req.body.data);
  if (isLegitimateAccount) {
    res.status(Http_CODE.SUCCESS).json({
      data: crypto.encrypt(isLegitimateAccount._id.toString()),
      code: CODE.SUCCESS,
      message: "ok",
    });
  } else {
    res
      .status(Http_CODE.SUCCESS)
      .json({ code: CODE.ERROR, message: "账户或密码错误" });
  }
};
// 查询用户信息
export const getUserInfo = async (
  req: IRequest<{}>,
  res: IRespond<IUserInfo>,
) => {
  const userId = crypto.decrypt(req.headers.authorization);
  const userInfo = await findUserById(userId);
  if (userInfo) {
    res.status(Http_CODE.SUCCESS).json({
      code: CODE.SUCCESS,
      message: "ok",
      data: {
        userName: userInfo.userName,
        eMail: userInfo.eMail,
      },
    });
  } else {
    res
      .status(Http_CODE.SUCCESS)
      .json({ code: CODE.ERROR, message: "账户不存在" });
  }
};
// 更新密码
export const updatePassword = async (
  req: IRequest<IUserInfo>,
  res: IRespond<{}>,
) => {
  const { userName, password, eMail } = req.body?.data;
  const userInfo = await findUserInfo({ userName, eMail });
  if (userInfo) {
    userInfo.password = password;
    const saveUserInfo = await updatePasswordById(userInfo);
    if (saveUserInfo) {
      res
        .status(Http_CODE.SUCCESS)
        .json({ code: CODE.SUCCESS, message: "修改密码成功！" });
    }
  } else {
    res
      .status(Http_CODE.SUCCESS)
      .json({ code: CODE.ERROR, message: "账户或邮箱错误" });
  }
};
// 更新用户信息
export const updateUserInfo = async (
  req: IRequest<{ type: string; value: string; password: string }>,
  res: IRespond<{}>,
) => {
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
        res
          .status(Http_CODE.SUCCESS)
          .json({ code: CODE.ERROR, message: "该账户名已存在" });
      } else {
        const saveUserInfo = await updateUserInfoById(userInfo);
        if (saveUserInfo) {
          res
            .status(Http_CODE.SUCCESS)
            .json({ code: CODE.SUCCESS, message: "修改用户名成功！" });
        }
      }
    } else if (type === "password") {
      const savePassword = updatePasswordById(userInfo);
      if (savePassword) {
        res
          .status(Http_CODE.SUCCESS)
          .json({ code: CODE.SUCCESS, message: "修改密码成功！" });
      }
    } else if (type === "eMail") {
      const hasDoubleEmail = await findUserInfo({ eMail: data.value });
      if (hasDoubleEmail) {
        res
          .status(Http_CODE.SUCCESS)
          .json({ code: CODE.ERROR, message: "该邮箱已存在" });
      } else {
        const saveUserInfo = await updateUserInfoById(userInfo);
        if (saveUserInfo) {
          res
            .status(Http_CODE.SUCCESS)
            .json({ code: CODE.SUCCESS, message: "修改邮箱成功！" });
        }
      }
    }
  } else {
    res
      .status(Http_CODE.SUCCESS)
      .json({ code: CODE.ERROR, message: "密码错误" });
  }
};
