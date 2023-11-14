import express from "express";
import { addFeedBack } from "@/controllers";
const feedBackRouter = express.Router();
/* 查询当天任务 */
feedBackRouter.post("/upload", addFeedBack);

export default feedBackRouter;
