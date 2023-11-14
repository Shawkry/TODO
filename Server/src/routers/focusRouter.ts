import express from "express";
import { addFocusTime } from "@/controllers";
const focusRouter = express.Router();
/* 查询当天任务 */
focusRouter.post("/upload", addFocusTime);

export default focusRouter;
