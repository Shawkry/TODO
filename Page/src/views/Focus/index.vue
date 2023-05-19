<!-- 
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-08 16:15:21
 * ⭐ @LastEditTime: 2022-04-26 10:35:29
 * ⭐ @Description: 专注模式模块
 -->
<template>
  <div class="focus">
    <div class="content">
      <div class="box1 snowBox">
        <Clock class="clock animate__animated animate__flipInX" />
      </div>
      <div class="box2 snowBox animate__animated animate__bounceIn">
        <div class="selectTask">
          <div class="selectTaskBox">
            <el-dropdown
              style="
                width: 100% !important;
                height: 100% !important;
                align-items: center !important;
              "
              @command="clickTask"
            >
              <span
                class="el-dropdown-link van-ellipsis"
                style="width: 100% !important; font-size: 1rem; cursor: pointer"
              >
                {{ selectTaskValue.message }}
                <van-icon name="arrow-down"></van-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in taskList"
                    :key="item.message"
                    :label="item.message"
                    :value="item.message"
                    :command="item"
                    >{{ item.message }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="time">
          <div class="progressClick" @click="timeSelectShow = true">
            <div class="progress" ref="progress_ref"></div>
          </div>
          <div
            class="focusBtn"
            style="position: relative; width: 60%; margin: 0 auto; z-index: 99"
          >
            <van-button
              style="position: relative; width: 100%"
              @click="data.value === 0 ? startFocus() : stopFocus()"
              :color="data.value === 0 ? '#91cc75' : '#ee6666'"
              >{{ data.value === 0 ? "开始专注" : "停止专注" }}</van-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 时间选择弹窗 -->
    <van-popup
      v-model:show="timeSelectShow"
      position="bottom"
      :style="{ height: '43%' }"
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

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import dayjs from "dayjs";
import { Notify, Dialog } from "vant";
import request from "@/common/request";
import Clock from "./clock.vue";
const progress_ref = ref();
const myChart = ref();
const data: any = reactive({
  title: "00:00:00",
  value: 0,
  task: {
    message: "",
    id: 0,
  },
  timeLength: 0,
  startTime: new Date(),
  endTime: new Date(),
});
const timeSelectShow = ref<boolean>(false);
const currentTime = ref("00:00");
const intervalValue = ref();
const selectTaskValue = reactive({
  message: "专注事件",
  id: 0,
});
const taskList: any = ref([]);
/* ================================================================================================
 * 🍊 @description: 点击菜单选项事件
 * 🍊 @Date: 2022-02-09 11:09:55
 * 🍊 @param {*} v string 菜单点击项
================================================================================================ */
const clickTask = (v: any) => {
  selectTaskValue.message = v.message;
  selectTaskValue.id = v.id;
};
/* ================================================================================================
 * 🍊 @description: 停止专注
 * 🍊 @Date: 2022-02-09 07:55:04
================================================================================================ */
const stopFocus = () => {
  clearInterval(intervalValue.value);
  data.value = 0;
  data.title = "00:00:00";
  initProgressChart();
};
/* ================================================================================================
 * 🍊 @description: 开始专注
 * 🍊 @Date: 2022-02-09 07:54:52
================================================================================================ */
const startFocus = () => {
  if (data.title === "00:00:00") {
    Notify({ message: "请先选择时间再开始专注", type: "warning" });
    return;
  }
  data.timeLength = currentTime.value;
  data.startTime = new Date();
  interval(data.title.split(":"));
};
/* ================================================================================================
 * 🍊 @description: 选择时间
 * 🍊 @Date: 2022-02-09 07:55:17
================================================================================================ */
const timeSelect = () => {
  data.title = currentTime.value + ":00";
  if (data.value !== 0) {
    startFocus();
    timeSelectShow.value = false;
    return;
  }
  initProgressChart();
  timeSelectShow.value = false;
};
/* ================================================================================================
 * 🍊 @description: 时间转换函数
 * 🍊 @Date: 2022-02-09 07:35:34
 * 🍊 @param {*} data string[]类型，[时,分,秒]
 * 🍊 @param {*} type 转换类型判断，second：秒转小时; hour: 时间转秒；
================================================================================================ */
const formatTime = (data: any, type: string) => {
  if (type === "second") {
    let hours = Math.floor((Number(data[2]) % 86400) / 3600).toString();
    let minutes = Math.floor(
      ((Number(data[2]) % 86400) % 3600) / 60
    ).toString();
    let seconds = Math.floor(
      ((Number(data[2]) % 86400) % 3600) % 60
    ).toString();
    if (hours.length === 1) {
      hours = "0" + hours;
    }
    if (minutes.length === 1) {
      minutes = "0" + minutes;
    }
    if (seconds.length === 1) {
      seconds = "0" + seconds;
    }
    const forMatDate = hours + ":" + minutes + ":" + seconds;
    return forMatDate;
  } else {
    return Number(data[0]) * 60 * 60 + Number(data[1]) * 60 + Number(data[2]);
  }
};
/* ================================================================================================
 * 🍊 @description: 定时器
 * 🍊 @Date: 2022-02-09 07:39:06
 * 🍊 @param {*} timeArr string[]类型，timeArr: [时,分,秒]
================================================================================================ */
const interval = (timeArr: any) => {
  clearInterval(intervalValue.value);
  let allTime: any = formatTime(timeArr, "hour");
  let count: any = allTime;

  function setIntervaltmp() {
    {
      data.value = (((allTime - count) / allTime) * 100).toFixed(1);
      data.title = formatTime([0, 0, count], "second");
      count--;
      if (count < 0) {
        if (data.value === "100.0") {
          uploadFocus();
        }
        clearInterval(intervalValue.value);
      }
      initProgressChart();
    }
    return setIntervaltmp;
  }
  intervalValue.value = setInterval(setIntervaltmp(), 1000);
};
/* ================================================================================================
 * 🍊 @description: 初始化环形进度条
 * 🍊 @Date: 2022-02-09 07:53:09
================================================================================================ */
const initProgressChart = () => {
  const gaugeData = [
    {
      value: data.value,
      detail: {
        valueAnimation: false,
        offsetCenter: ["0%", "59%"],
      },
    },
  ];
  const option = {
    title: {
      text: data.title,
      subtext: "请轻触选择时间",
      left: "center",
      top: "center",
      textStyle: {
        fontSize: "2.2rem",
        color: "#5470c6",
      },
      subtextStyle: {
        color: "#aaa",
        fontSize: 12,
      },
      itemGap: 0,
    },
    series: [
      {
        type: "gauge",
        center: ["50%", "50%"],
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            borderColor: "#a8bbd1",
          },
        },
        axisLine: {
          lineStyle: {
            width: 15,
            color: [[1, "rgba(221, 221, 221, 0.6)"]],
          },
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          distance: 50,
        },
        data: gaugeData,
        detail: {
          width: 50,
          height: 14,
          fontSize: 14,
          color: "inherit",
          borderColor: "inherit",
          borderRadius: 20,
          borderWidth: 1,
          formatter: "{value}%",
        },
      },
    ],
  };
  myChart.value.setOption(option);
};
/* ================================================================================================
 * 🍊 @description: 上传本次专注
 * 🍊 @Date: 2022-02-09 11:41:00
================================================================================================ */
const uploadFocus = () => {
  data.endTime = new Date();
  data.task.message = selectTaskValue.message;
  data.task.id = selectTaskValue.id;
  const params = {
    startTime: dayjs(data.startTime).format("YYYY-MM-DD-HH-mm").split("-"),
    timeLength:
      Number(data.timeLength.slice(0, 2)) * 60 +
      Number(data.timeLength.slice(3, 5)),
    task: data.task,
  };
  if (selectTaskValue.id !== 0) {
    request.post("finishTask", { id: data.task.id }).then((res) => {
      selectTaskValue.id = 0;
      selectTaskValue.message = "专注事件";
      getData();
    });
  }
  request.post("focusTime", params).then((res: any) => {
    Dialog.alert({
      title: "提示",
      message: "已完成本次专注！",
      confirmButtonColor: "#91cc75",
    }).then(() => {
      stopFocus();
    });
  });
};
/* ================================================================================================
 * 🍊 @description: 获取今日待办
 * 🍊 @Date: 2022-02-09 11:13:55
================================================================================================ */
const getData = () => {
  request
    .post("getData", {
      time: dayjs(new Date()).format("YYYY-MM-DD"),
      mode: "1",
    })
    .then((res: any) => {
      taskList.value = res.map((item: any) => {
        return { message: item.message, id: item._id, finish: item.finish };
      });
      taskList.value.forEach((element: any, index: any) => {
        element.finish ? taskList.value.splice(index, 1) : null;
      });
      taskList.value.unshift("专注事件");
    });
};
onMounted(() => {
  myChart.value = echarts.init(progress_ref.value);
  getData();
  initProgressChart();
  initProgressChart();
});
onBeforeUnmount(() => {
  clearInterval(intervalValue.value);
});
</script>

<style lang="scss" scoped>
.focus {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(@/assets/img/background.jpg);
  background-size: 100% 100%;
  //   overflow-y: scroll;
}
.content {
  position: relative;
  width: 100%;
  height: 100%;
  top: 6%;
  //   margin-top: 10%;
  //   overflow: auto;
  .box1 {
    position: relative;

    margin: 0 auto;
    height: 20%;
    width: 90%;
    // background-color: rgba(255, 255, 255, 0.5);
  }
  .box2 {
    position: relative;
    margin: 3rem auto;
    height: 62%;
    width: 90%;
    background-color: rgba(255, 255, 255, 0.5);
    .selectTask {
      position: relative;
      height: 10%;
      width: 100%;
      .selectTaskBox {
        width: 60%;
        height: 100%;
        margin: 0 auto;
      }
    }
    .time {
      position: relative;
      height: 88%;
      width: 100%;
      .progressClick {
        position: relative;
        width: 100%;
        height: 85%;

        .progress {
          position: relative;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
