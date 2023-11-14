import crypto from "@/utils/crypto";
import dayjs from "dayjs";
import { findTasksByQueryRule } from "@/models/tasks";
import { TASK_TYPE, TODO_TYPE, WEEK_LENGTH } from "@/constants/task";
import { CODE } from "@/constants/http_code";
import type { IRequest, IRespond } from "@/types";

export const taskTypeDistributionData = async (
  req: IRequest<{ start: Date; end: Date }>,
  res: IRespond<{ name: string; value: number }[]>,
) => {
  const { data } = req.body;
  const user = crypto.decrypt(req.headers.authorization);
  const queryRule = {
    time: { $gte: data.start, $lt: data.end },
    user: user,
  };
  const tasks = await findTasksByQueryRule(queryRule);
  const result: { name: string; value: number }[] = [];
  const taskTypeCount: { [key: string]: number } = {
    [TASK_TYPE.study]: 0,
    [TASK_TYPE.work]: 0,
    [TASK_TYPE.memo]: 0,
    [TASK_TYPE.entertainment]: 0,
    [TASK_TYPE.sport]: 0,
  };
  if (tasks && tasks.length > 0) {
    tasks.forEach((task) => {
      if (taskTypeCount[task.tag] !== undefined) taskTypeCount[task.tag]++;
    });
  }
  for (const type in taskTypeCount) {
    result.push({ name: type, value: taskTypeCount[type] });
  }
  res.json({ code: CODE.SUCCESS, message: "ok", data: result });
};

export const getWaterBallChartData = async (
  req: IRequest<{ startTime: Date; endTime: Date }>,
  res: IRespond<{
    task: { finish: number; total: number; completeness: number };
    summary: { finish: number; total: number; completeness: number };
  }>,
) => {
  const { data } = req.body;
  const user = crypto.decrypt(req.headers.authorization);
  const queryRule = {
    time: { $gte: data.startTime, $lt: data.endTime },
    user: user,
  };
  const result = {
    task: { finish: 0, total: 0, completeness: 0 },
    summary: { finish: 0, total: 0, completeness: 0 },
  };
  const tasks = await findTasksByQueryRule({
    ...queryRule,
    type: TODO_TYPE.TASK,
  });
  const summary = await findTasksByQueryRule({
    ...queryRule,
    type: TODO_TYPE.SUMMARY,
  });
  if (tasks && tasks.length > 0) {
    const finishTasks = tasks.filter((item) => item.finish);
    result.task = {
      finish: finishTasks.length,
      total: tasks.length,
      completeness: Number((finishTasks.length / tasks.length).toFixed(2)),
    };
  }
  if (summary && summary.length > 0) {
    const finishSummary = summary.filter((item) => item.message !== "");
    result.summary = {
      finish: finishSummary.length,
      total: WEEK_LENGTH,
      completeness: Number((finishSummary.length / WEEK_LENGTH).toFixed(2)),
    };
  }
  res.json({ code: CODE.SUCCESS, message: "ok", data: result });
};

export const getTimeChartData = async (
  req: IRequest<{ time: Date }>,
  res: IRespond<number[]>,
) => {
  const { data } = req.body;
  const user = crypto.decrypt(req.headers.authorization);
  const thisMonth = {
    start: new Date(dayjs(data.time).startOf("month").format("YYYY-MM-DD")),
    end: new Date(
      dayjs(data.time).endOf("month").add(1, "day").format("YYYY-MM-DD"),
    ),
    len: Number(
      dayjs(data.time)
        .startOf("month")
        .add(1, "month")
        .subtract(1, "day")
        .format("D"),
    ),
    str: dayjs(data.time).format("MM"),
  };
  const result = new Array(thisMonth.len).fill(0);
  const queryRule = {
    time: { $gte: thisMonth.start, $lt: thisMonth.end },
    user: user,
  };
  const tasks = await findTasksByQueryRule(queryRule);
  if (tasks && tasks.length > 0) {
    tasks.forEach((task) => {
      if (task.type === TODO_TYPE.TASK && !task.finish) return;
      const index = Number(dayjs(task.time).format("D"));
      result[index - 1] += task.workTime;
    });
  }
  res.json({ code: CODE.SUCCESS, message: "ok", data: result });
};
