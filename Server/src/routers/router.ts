/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-03 21:41:42
 * ⭐ @LastEditTime: 2022-04-27 13:00:58
 * ⭐ @Description: 路由
 */
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUserInfo,
  updatePassword,
  updateUserMessage,
  getTodayTaskData,
  createTask,
  updateTask,
  deleteTask,
  finishTask,
  taskTypeDistributionData,
  getWaterBallChartData,
  getTimeChartData,
  addFocusTime,
  addFeedBack,
  createTip,
} = require("@/controllers");
/* 注册账号 */
router.post("/register", register);
/* 登录账号 */
router.post("/login", login);
/* 用户信息查询 */
router.post("/getUserData", getUserInfo);
/* 找回用户密码 */
router.post("/updatePassword", updatePassword);
/* 修改用户信息 */
router.post("/updateUserMessage", updateUserMessage);

/* 查询当天任务 */
router.post("/getData", getTodayTaskData);
/* 新增待办或总结 */
router.post("/createTask", createTask);
/* 修改任务 */
router.post("/updateTask", updateTask);
/* 删除任务 */
router.post("/deleteTask", deleteTask);

/* 修改任务完成状况 */
router.post("/finishTask", finishTask);
/* 获取任务类型分布数据 */
router.post("/getTaskTypeData", taskTypeDistributionData);
/* 获取水球图数据 */
router.post("/getWaterBallChartData", getWaterBallChartData);
/* 获取时间折线图数据 */
router.post("/getTimeChartData", getTimeChartData);
/* 上传专注 */
router.post("/focusTime", addFocusTime);

/* 上传建议 */
router.post("/feedBack", addFeedBack);
/* 新增提示 */
router.post("/newTip", createTip);
// module.exports = router;
export { router };
