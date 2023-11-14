import express from "express";
const router = express.Router();
import userRouter from "@/routers/userRouter";
import tasksRouter from "@/routers/tasksRouter";
import statisticsRouter from "@/routers/statisticsRouter";
import focusRouter from "@/routers/focusRouter";
import feedBackRouter from "@/routers/feedBackRouter";
router.use("/user", userRouter);
router.use("/tasks", tasksRouter);
router.use("/focus", focusRouter);
router.use("/statistics", statisticsRouter);
router.use("/feedBack", feedBackRouter);

export default router;
