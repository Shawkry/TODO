const userList = require("@/models/schema/userList");
const crypto = require("@/common/crypto.js");

export const createUser = async (userInfo: {
  userName: string;
  password: string;
  eMail: string;
}) => {
  console.log(userInfo);
  const { userName, eMail } = userInfo;
  const password = crypto.md5(crypto.md5(userInfo.password));
  const saveUserInfo = await new userList({ userName, eMail, password }).save();
  if (saveUserInfo) {
    return saveUserInfo;
  } else {
    return null;
  }
};

export const verifyUser = async (userInfo: {
  userName: string;
  password: string;
}) => {
  userInfo.password = crypto.md5(crypto.md5(userInfo.password));
  try {
    return await userList.findOne(userInfo);
  } catch (e) {
    console.log(e, "error");
  }
};

export const findUserById = async (id: string) => {
  try {
    return await userList.findOne({ _id: id });
  } catch (e) {
    console.log(e, "error");
  }
};

export const updatePasswordById = async (userInfo: {
  id: string;
  password: string;
}) => {
  const id = userInfo.id;
  const password = crypto.md5(crypto.md5(userInfo.password));
  try {
    return await userList.updateOne({ _id: id }, { password: password });
  } catch (e) {
    console.log(e, "error");
  }
};

export const updateUserInfoById = async (userInfo: {
  id: string;
  password: string;
}) => {
  const { id } = userInfo;
  try {
    return await userList.updateOne({ _id: id }, userInfo);
  } catch (e) {
    console.log(e, "error");
  }
};

export const findUserInfo = async (userInfo: {
  _id?: string;
  password?: string;
  userName?: string;
  eMail?: string;
}) => {
  if (userInfo.password) crypto.md5(crypto.md5(userInfo.password));
  try {
    return await userList.findOne(userInfo);
  } catch (e) {
    console.log(e, "error");
  }
};
