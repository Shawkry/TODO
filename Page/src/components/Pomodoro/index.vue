<!-- 
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-08 19:05:37
 * ⭐ @LastEditTime: 2022-04-26 11:24:15
 * ⭐ @Description: 番茄钟组件
 -->
<template>
  <div class="pomodoro">
    <div class="progress" ref="progress_ref" @click="timeSelectShow = true" />
    <div
      class="focusBtn"
      style="position: relative; width: 60%; margin: 0 auto; z-index: 99"
    >
      <van-button
        style="position: relative; width: 100%"
        @click="isStartFocus ? stopFocus() : startFocus()"
        :color="isStartFocus ? '#ee6666' : '#91cc75'"
        >{{ isStartFocus ? "停止专注" : "开始专注" }}</van-button
      >
    </div>
    <!-- 时间选择弹窗 -->
    <van-popup
      v-model:show="timeSelectShow"
      position="bottom"
      :style="{ height: '40%' }"
      teleport="#app"
    >
      <van-datetime-picker
        v-model="currentTime"
        type="time"
        title="选择时间(时/分)"
        :min-hour="0"
        :max-hour="6"
        :max-minute="59"
        :min-minute="0"
        @confirm="timeSelect()"
        @cancel="timeSelectShow = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import * as echarts from "echarts";
import dayjs from "dayjs";
import { Dialog, Notify } from "vant";
import request from "@/utils/request";
import { API_LIST } from "@/constants/api";
import { TODO_TYPE } from "@/constants/task";
import type { ITask, IFocusTaskData } from "@/types";
import {
  CONVERT_TIME_TYPE,
  POMODORO_OPTIONS,
  INIT_TIME_TITLE,
} from "@/constants/pomodoro";
import { TIME_CONSTANTS } from "@/constants/date";
const props = defineProps(["selectTaskValue"]);
const selectTaskValue = props.selectTaskValue;
watch(props.selectTaskValue, () => {
  selectTaskValue.value = props.selectTaskValue;
});
const progress_ref = ref();
const myChart = ref();
const data: IFocusTaskData = reactive({
  title: INIT_TIME_TITLE,
  progress: 0,
  task: {
    message: "",
    id: "",
  },
  timeLength: 0,
  startTime: new Date(),
  endTime: new Date(),
});
const timeSelectShow = ref(false);
const currentTime = ref("00:00");
const intervalValue = ref();
const taskList = ref([]);
const isStartFocus = ref(false);
/* ================================================================================================
 * 🍊 @description: 停止专注
 * 🍊 @Date: 2022-02-09 07:55:04
================================================================================================ */
const stopFocus = async () => {
  clearInterval(intervalValue.value);
  data.progress = 0;
  isStartFocus.value = false;
  data.title = INIT_TIME_TITLE;
  await initProgressChart(data);
};
/* ================================================================================================
 * 🍊 @description: 开始专注
 * 🍊 @Date: 2022-02-09 07:54:52
================================================================================================ */
const startFocus = async () => {
  if (data.title === INIT_TIME_TITLE) {
    return Notify({ message: "请先选择时间再开始专注", type: "warning" });
  }
  isStartFocus.value = true;
  data.timeLength = convertTime(
    CONVERT_TIME_TYPE.TO_NUMBER,
    currentTime.value + ":00",
  ) as number;
  data.startTime = new Date();
  interval(data.title);
};
/* ================================================================================================
 * 🍊 @description: 选择时间
 * 🍊 @Date: 2022-02-09 07:55:17
================================================================================================ */
const timeSelect = () => {
  data.title = currentTime.value + ":00";
  if (isStartFocus.value) {
    startFocus();
    timeSelectShow.value = false;
    return;
  }
  initProgressChart(data);
  timeSelectShow.value = false;
};
/* ================================================================================================
 * 🍊 @description: 时间转换函数
 * 🍊 @Date: 2022-02-09 07:35:34
 * 🍊 @param {types}  转换类型判断，1：秒转时分秒字符串; 2: 时分秒字符串转秒；
 * 🍊 @param {value} 时分秒字符串 | number类型的秒
================================================================================================ */
const convertTime = (type: number, value: string | number) => {
  if (type === CONVERT_TIME_TYPE.TO_STRING && typeof value === "number") {
    const hours = Math.floor(value / TIME_CONSTANTS.SEC_PER_HOUR)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor(
      (value % TIME_CONSTANTS.SEC_PER_HOUR) / TIME_CONSTANTS.SEC_PER_MIN,
    )
      .toString()
      .padStart(2, "0");
    const seconds = String(value % TIME_CONSTANTS.SEC_PER_MIN).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
  if (type === CONVERT_TIME_TYPE.TO_NUMBER && typeof value === "string") {
    const times = value.split(":");
    const hours = parseInt(times[0]);
    const minutes = parseInt(times[1]);
    const seconds = parseInt(times[2]);
    return (
      hours * TIME_CONSTANTS.SEC_PER_HOUR +
      minutes * TIME_CONSTANTS.SEC_PER_MIN +
      seconds
    );
  }
};
/* ================================================================================================
 * 🍊 @description: 倒计时
 * 🍊 @Date: 2022-02-09 07:39:06
 * 🍊 @param {time} 时分秒字符串
================================================================================================ */
const interval = (time: string) => {
  clearInterval(intervalValue.value);
  let totalSeconds = convertTime(CONVERT_TIME_TYPE.TO_NUMBER, time) as number;
  let currentSecond: number = totalSeconds;
  const countdown = () => {
    {
      const progress = ((totalSeconds - currentSecond) / totalSeconds) * 100;
      data.progress = Number(progress.toFixed(1));
      data.title = convertTime(
        CONVERT_TIME_TYPE.TO_STRING,
        currentSecond,
      ) as string;
      currentSecond--;
      if (currentSecond < 0) {
        uploadFocus();
        clearInterval(intervalValue.value);
      }
      initProgressChart(data);
    }
    return countdown;
  };
  intervalValue.value = setInterval(countdown(), TIME_CONSTANTS.ONE_SECOND);
};
/* ================================================================================================
 * 🍊 @description: 初始化环形进度条
 * 🍊 @Date: 2022-02-09 07:53:09
================================================================================================ */
const initProgressChart = async (data: { progress: number; title: string }) => {
  const { progress, title } = data;
  const gaugeData = [
    {
      value: progress,
      detail: {
        valueAnimation: true,
        offsetCenter: ["0%", "59%"],
      },
    },
  ];
  const option = {
    title: {
      ...POMODORO_OPTIONS.title,
      text: title,
    },
    series: [
      {
        ...POMODORO_OPTIONS.series[0],
        data: gaugeData,
      },
    ],
  };
  await myChart.value.setOption(option);
};
/* ================================================================================================
 * 🍊 @description: 上传本次专注
 * 🍊 @Date: 2022-02-09 11:41:00
================================================================================================ */
const uploadFocus = async () => {
  data.endTime = new Date();
  data.task.message = selectTaskValue.message;
  data.task.id = selectTaskValue.id;
  const timeLength = data.timeLength / 60;
  const params = {
    startTime: dayjs(data.startTime).format("YYYY-MM-DD-HH-mm").split("-"),
    timeLength: timeLength,
    task: data.task,
  };
  const uploadFocusRes = await request.post(API_LIST.UPLOAD_FOCUS, params);
  if (uploadFocusRes) {
    await Dialog.alert({
      title: "提示",
      message: "已完成本次专注！",
      confirmButtonColor: "#91cc75",
    });
    await stopFocus();
  }
  if (selectTaskValue.id !== "") {
    const finishTaskRes = await request.post(API_LIST.FINISH_TASK, {
      id: data.task.id,
    });
    if (!finishTaskRes) return;
    selectTaskValue.id = "";
    selectTaskValue.message = "专注事件";
    await getData();
  }
};
/* ================================================================================================
 * 🍊 @description: 获取今日待办
 * 🍊 @Date: 2022-02-09 11:13:55
================================================================================================ */
const getData = async () => {
  const res = await request.post(API_LIST.GET_TASK_DATA, {
    time: dayjs(new Date()).format("YYYY-MM-DD"),
    type: TODO_TYPE.TASK,
  });
  if (!res) {
    return Notify({ type: "danger", message: "网络错误" });
  }
  taskList.value = res.data
    ?.filter((task: ITask) => !task?.finish)
    ?.map((task: ITask) => {
      return { message: task.message, id: task._id, finish: task.finish };
    });
};
onMounted(async () => {
  myChart.value = echarts.init(progress_ref.value);
  await getData();
  await initProgressChart(data);
});
onBeforeUnmount(() => {
  clearInterval(intervalValue.value);
});
</script>

<style lang="scss" scoped>
.pomodoro {
  position: relative;
  width: 100%;
  height: 85%;
  .progress {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
