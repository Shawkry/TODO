import crypto from "@/utils/crypto";
import dayjs from "dayjs";
import {
  findOneTaskByQueryRule,
  findTasksByQueryRule,
  updateTodo,
  createTodo,
  deleteTodo,
} from "@/models/tasks";
import { TODO_TYPE } from "@/constants/task";
import { CODE } from "@/constants/http_code";
import type { ITask, IRequest, IRespond, IQueryTask } from "@/types";

export const getTodayTaskData = async (
  req: IRequest<{ time: Date; type: number }>,
  res: IRespond<ITask>,
) => {
  const userId: string = crypto.decrypt(req.headers.authorization);
  const { time, type } = req.body?.data;
  const today = {
    begin: new Date(dayjs(time).format("YYYY-MM-DD")),
    end: new Date(dayjs(time).add(1, "day").format("YYYY-MM-DD")),
  };
  const queryRule: IQueryTask = {
    time: { $gte: today.begin, $lt: today.end },
    user: userId,
  };
  if (type) queryRule["type"] = type;
  const tasks = await findTasksByQueryRule(queryRule);
  if (tasks)
    return res.json({ code: CODE.SUCCESS, message: "ok", data: tasks });
};

export const createTask = async (req: IRequest<ITask>, res: IRespond<{}>) => {
  const user = crypto.decrypt(req.headers.authorization);
  const { type, message, time, tag, workTime } = req.body?.data;
  const todo: ITask = {
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
      res.json({ code: CODE.SUCCESS, message: "修改总结成功" });
    } else if (todo.message) {
      await createTodo(todo);
      res.json({ code: CODE.SUCCESS, message: "新增总结成功" });
    }
  } else if (todo.type === TODO_TYPE.TASK) {
    await createTodo(todo);
    res.json({ code: CODE.SUCCESS, message: "新增任务成功" });
  }
};

export const updateTask = async (req: IRequest<ITask>, res: IRespond<{}>) => {
  const user: string = crypto.decrypt(req.headers.authorization);
  const { data } = req.body;
  const queryRule = { _id: data._id, user: user };
  const task = await findOneTaskByQueryRule(queryRule);
  if (task) {
    task.message = data.message;
    task.tag = data.tag;
    task.workTime = Number(data.workTime);
    task.finish = false;
    await updateTodo(task);
    res.json({
      code: CODE.SUCCESS,
      message: "删除任务成功",
      data: { type: "success" },
    });
  } else {
    res.json({
      code: CODE.ERROR,
      message: "删除任务成功",
      data: { type: "success" },
    });
  }
};

export const deleteTask = async (
  req: IRequest<{ user: string }>,
  res: IRespond<{}>,
) => {
  req.body.data.user = crypto.decrypt(req.headers.authorization);
  await deleteTodo(req.body.data);
  res.json({
    code: CODE.SUCCESS,
    message: "删除任务成功",
    data: { type: "success" },
  });
};

export const finishTask = async (
  req: IRequest<{ id: string }>,
  res: IRespond<{}>,
) => {
  const user = crypto.decrypt(req.headers.authorization);
  const { id } = req.body?.data;
  const queryRule = { _id: id, user: user };
  const task = await findOneTaskByQueryRule(queryRule);
  if (task) {
    task.finish = !task.finish;
    await updateTodo(task);
    res.json({ code: CODE.SUCCESS, message: "完成任务成功" });
  } else {
    res.json({ code: CODE.ERROR, message: "完成任务失败" });
  }
};

export const addFocusTime = async (
  req: IRequest<{
    startTime: string[];
    timeLength: number;
    task: ITask;
  }>,
  res: IRespond<{}>,
) => {
  const user = crypto.decrypt(req.headers.authorization);
  const { data } = req.body;
  const startTime = new Date(
    Number(data.startTime[0]),
    Number(data.startTime[1]) - 1,
    Number(data.startTime[2]),
    Number(data.startTime[3]),
    Number(data.startTime[4]),
  );
  const todo = {
    message: data.task.message,
    time: startTime,
    type: TODO_TYPE.FOCUS,
    workTime: data.timeLength,
    tag: "专注",
    user: user,
  };
  await createTodo(todo);
  res.json({ code: CODE.SUCCESS, message: "完成专注！" });
};

export const addFeedBack = async (
  req: IRequest<{ feedBackMessage: string; rateValue: number }>,
  res: IRespond<{}>,
) => {
  const user = crypto.decrypt(req.headers.authorization);
  const { data } = req.body;
  if (!data.feedBackMessage) return;
  const value = {
    message: data.feedBackMessage,
    time: new Date(),
    type: TODO_TYPE.SUGGESTION,
    workTime: data?.rateValue ?? 5,
    tag: "建议",
    user: user,
  };
  await createTodo(value);
  res.json({ code: CODE.SUCCESS, message: "建议发送成功！" });
};

export const createTip = async (req: IRequest<ITask>, res: IRespond<{}>) => {
  const { data } = req.body;
  const user: string = crypto.decrypt(req.headers.authorization);
  const newTip = {
    ...data,
    time: new Date(data.time),
    user: user,
  };
  const tip = await findOneTaskByQueryRule({ user: user });
  if (!tip) {
    await createTodo(newTip);
  }
  res.json({ code: CODE.SUCCESS, message: "" });
};
