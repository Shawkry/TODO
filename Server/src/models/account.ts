import type { IUserInfo } from "@/types/user";
import UserList from "@/models/schema/userList";
import crypto from "@/utils/crypto";
export const createUser = async (userInfo: IUserInfo) => {
  const { userName, eMail } = userInfo;
  const password = crypto.md5(crypto.md5(userInfo.password));
  const saveUserInfo = await new UserList({ userName, eMail, password }).save();
  if (saveUserInfo) {
    return saveUserInfo;
  }
  return null;
};

export const verifyUser = async (userInfo: IUserInfo) => {
  userInfo.password = crypto.md5(crypto.md5(userInfo.password));
  try {
    return await UserList.findOne(userInfo).exec();
  } catch (e) {
    console.error(e, "error");
  }
};

export const findUserById = async (id: string) => {
  try {
    return await UserList.findOne({ _id: id }).exec();
  } catch (e) {
    console.error(e, "error");
  }
};

export const updatePasswordById = async (userInfo: IUserInfo) => {
  const id = userInfo.id;
  const password = crypto.md5(crypto.md5(userInfo.password));
  try {
    return await UserList.updateOne({ _id: id }, { password: password });
  } catch (e) {
    console.error(e, "error");
  }
};

export const updateUserInfoById = async (userInfo: IUserInfo) => {
  const { id } = userInfo;
  try {
    return await UserList.updateOne({ _id: id }, userInfo);
  } catch (e) {
    console.error(e, "error");
  }
};

export const findUserInfo = async (userInfo: IUserInfo) => {
  if (userInfo.password) crypto.md5(crypto.md5(userInfo.password));
  try {
    return await UserList.findOne(userInfo).exec();
  } catch (e) {
    console.error(e, "error");
  }
};
