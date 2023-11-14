import express from "express";
import {
  getTodayTaskData,
  createTask,
  updateTask,
  deleteTask,
  finishTask,
  createTip,
} from "@/controllers";
const tasksRouter = express.Router();
/* 查询当天任务 */
tasksRouter.post("/data", getTodayTaskData);
/* 新增待办或总结 */
tasksRouter.post("/create", createTask);
/* 修改任务 */
tasksRouter.post("/update", updateTask);
/* 删除任务 */
tasksRouter.post("/delete", deleteTask);
/* 修改任务完成状况 */
tasksRouter.post("/finish", finishTask);
/* 新增提示 */
tasksRouter.post("/newTip", createTip);

export default tasksRouter;
