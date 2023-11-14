import express from "express";
import {
  taskTypeDistributionData,
  getWaterBallChartData,
  getTimeChartData,
} from "@/controllers";
const statisticsRouter = express.Router();
/* 注册账号 */
/* 获取任务类型分布数据 */
statisticsRouter.post("/taskTypeData", taskTypeDistributionData);
/* 获取时间折线图数据 */
statisticsRouter.post("/timeChartData", getTimeChartData);
/* 获取水球图数据 */
statisticsRouter.post("/waterBallChartData", getWaterBallChartData);

export default statisticsRouter;
