export const API_LIST = {
  // 用户相关
  REGISTER: "/user/register",
  LOGIN: "/user/login",
  GET_USER_INFO: "/user/info",
  UPDATE_USER_INFO: "/user/updateInfo",
  UPDATE_PASSWORD: "/user/updatePassword",

  // 任务相关
  GET_TASK_DATA: "/tasks/data",
  CREATE_TASK: "/tasks/create",
  UPDATE_TASK: "/tasks/upDate",
  DELETE_TASK: "/tasks/delete",
  FINISH_TASK: "/tasks/finish",
  NEW_TIP: "/tasks/newTip",

  // 数据统计相关
  GET_TASK_TYPE_DATA: "/statistics/taskTypeData",
  GET_TIME_CHART_DATA: "/statistics/timeChartData",
  GET_WATER_BALL_CHART_DATA: "/statistics/waterBallChartData",

  // 专注相关
  UPLOAD_FOCUS: "/focus/upload",
  // 用户反馈相关
  FEED_BACK: "/feedBack/upload",
};
