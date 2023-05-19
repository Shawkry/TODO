import crypto from "@/common/crypto.js";
import dayjs from "dayjs";
import {
  findOneTaskByQueryRule,
  findTasksByQueryRule,
  updateTodo,
  createTodo,
  deleteTodo,
} from "@/models/tasks";
import { TODO_TYPE } from "@/constants/task";

export const getTodayTaskData = async (req, res) => {
  const user = crypto.decrypt(req.headers.authorization);
  const { time, mode } = req.body?.data;
  const today = {
    begin: new Date(dayjs(time).format("YYYY-MM-DD")),
    end: new Date(dayjs(time).add(1, "day").format("YYYY-MM-DD")),
  };
  const queryRule = { time: { $gte: today.begin, $lt: today.end }, user: user };
  if (mode) queryRule["type"] = Number(mode);
  const tasks = await findTasksByQueryRule(queryRule);
  if (tasks) return res.json(tasks);
};

export const createTask = async (req, res) => {
  const user = crypto.decrypt(req.headers.authorization);
  const { type, message, time, tag, workTime } = req.body?.data;
  const todo = {
    message: message,
    type: type,
    time: new Date(time),
    finish: false,
    tag: tag,
    workTime: Number(workTime),
    user: user,
  };

  if (todo.type === TODO_TYPE.SUMMARY) {
    const today = {
      begin: new Date(dayjs(todo.time).format("YYYY-MM-DD")),
      end: new Date(dayjs(todo.time).add(1, "day").format("YYYY-MM-DD")),
    };
    const queryRule = {
      time: { $gte: today.begin, $lt: today.end },
      type: TODO_TYPE.SUMMARY,
      user: user,
    };
    const task = await findOneTaskByQueryRule(queryRule);
    if (task) {
      task.message = todo.message;
      await updateTodo(task);
      res.json({ type: "success", message: "修改总结成功" });
    } else {
      await createTodo(todo);
      res.json({ type: "success", message: "新增总结成功" });
    }
  } else if (todo.type === TODO_TYPE.TASK) {
    await createTodo(todo);
    res.json({ type: "success", message: "新增任务成功" });
  }
};

export const updateTask = async (req, res) => {
  const user = crypto.decrypt(req.headers.authorization);
  const { data } = req.body;
  const queryRule = { _id: data.taskId, user: user };
  const task = await findOneTaskByQueryRule(queryRule);
  if (task) {
    task.message = data.message;
    task.tag = data.tag;
    task.workTime = Number(data.workTime);
    task.finish = false;
    await updateTodo(task);
    res.json({ type: "success", message: "修改任务成功" });
  } else {
    res.json({ type: "error", message: "修改任务失败" });
  }
};

export const deleteTask = async (req, res) => {
  req.body.data.user = crypto.decrypt(req.headers.authorization);
  await deleteTodo(req.body.data);
  res.json({ type: "success", message: "删除任务成功" });
};

export const finishTask = async (req, res) => {
  const user = crypto.decrypt(req.headers.authorization);
  const { id } = req.body?.data;
  const queryRule = { _id: id, user: user };
  const task = await findOneTaskByQueryRule(queryRule);
  if (task) {
    task.finish = !task.finish;
    await updateTodo(task);
    res.json({ code: "200" });
  } else {
    res.json({ code: "404" });
  }
};

export const addFocusTime = async (req, res) => {
  const user = crypto.decrypt(req.headers.authorization);
  const { data } = req.body;
  data.startTime = new Date(
    Number(data.startTime[0]),
    Number(data.startTime[1] - 1),
    Number(data.startTime[2]),
    Number(data.startTime[3]),
    Number(data.startTime[4])
  );
  const value = {
    message: data.task.message,
    time: data.startTime,
    type: TODO_TYPE.FOCUS,
    workTime: Number(data.timeLength),
    tag: "专注",
    user: user,
  };
  await createTodo(value);
  res.json({ message: "完成专注！", type: "success" });
};

export const addFeedBack = async (req, res) => {
  const user = crypto.decrypt(req.headers.authorization);
  const { data } = req.body;
  const value = {
    message: data.feedBackMessage,
    time: new Date(),
    type: TODO_TYPE.SUGGESTION,
    workTime: Number(data.rateValue),
    tag: "建议",
    user: user,
  };
  await createTodo(value);
  res.json({ message: "建议发送成功！", type: "success" });
};

export const createTip = async (req, res) => {
  const { data } = req.body;
  const user = crypto.decrypt(req.headers.authorization);
  const newTip = {
    message: data.message,
    type: Number(data.type),
    time: new Date(data.time),
    finish: Boolean(data.finish),
    tag: data.tag,
    workTime: Number(data.workTime),
    user: user,
  };
  const tip = await findOneTaskByQueryRule({ user: user });
  if (!tip) {
    await createTodo(newTip);
  }
  res.json({});
};
