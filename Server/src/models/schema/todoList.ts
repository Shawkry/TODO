/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-03 21:41:43
 * ⭐ @LastEditTime: 2022-04-25 21:48:41
 * ⭐ @Description: 数据表
 */
import mongoose, { Schema } from "mongoose";
import { CONFIG } from "../../config";
const {
  DB: { host, user, password },
} = CONFIG;
const TABLE_NAME = "Todolist";
mongoose.connect(
  `mongodb://${user}:${password}@${host}/Todo?authSource=admin`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const TodoListSchema = new Schema({
  time: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  finish: {
    type: Boolean,
    default: false,
  },
  type: {
    type: Number,
    required: true,
  },
  tag: {
    type: String,
    default: "总结",
  },
  workTime: {
    type: Number,
    default: 0,
  },
  user: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model(TABLE_NAME, TodoListSchema);
