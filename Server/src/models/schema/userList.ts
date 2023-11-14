/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-04-25 15:03:25
 * ⭐ @LastEditTime: 2022-04-25 21:23:51
 * ⭐ @Description: 用户表
 */
import mongoose, { Schema } from "mongoose";
const TABLE_NAME = "UserList";

mongoose.connect(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/Todo?authSource=admin`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
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
    default: "/img",
  },
});
export default mongoose.model(TABLE_NAME, UserListSchema);
