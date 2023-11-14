/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-03 21:41:43
 * ⭐ @LastEditTime: 2022-04-25 21:48:41
 * ⭐ @Description: 数据表
 */
import mongoose, { Schema } from "mongoose";
const TABLE_NAME = "TodoList";
mongoose.connect(
  `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/Todo?authSource=admin`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
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

export default mongoose.model(TABLE_NAME, TodoListSchema);
