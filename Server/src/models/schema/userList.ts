/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-04-25 15:03:25
 * ⭐ @LastEditTime: 2022-04-25 21:23:51
 * ⭐ @Description: 用户表
 */
import mongoose, { Schema } from "mongoose";
import { CONFIG } from "../../config";
const {
  DB: { host, user, password },
} = CONFIG;
const TABLE_NAME = "Userlist";
mongoose.connect(
  `mongodb://${user}:${password}@${host}/Todo?authSource=admin`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const UserListSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  eMail: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    require: true,
    defult: "/img",
  },
});
module.exports = mongoose.model(TABLE_NAME, UserListSchema);
