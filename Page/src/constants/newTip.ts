import dayjs from "dayjs";
import { TAG_TYPE, TODO_TYPE } from "@/constants/task";

export const newTip = {
  message: "👈左划可以编辑和删除哦",
  time: dayjs(new Date()).format("YYYY-MM-DD"),
  type: TODO_TYPE.TASK,
  tag: TAG_TYPE.STUDY,
  workTime: 0,
  finish: false,
};
