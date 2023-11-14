<!-- 
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-05 15:37:38
 * ⭐ @LastEditTime: 2022-02-28 18:43:11
 * ⭐ @Description: 数据统计模块
 -->
<template>
  <div class="dataStatisticsPage">
    <div class="content">
      <!-- 完成度 -->
      <div class="box1">
        <div class="todayTask snowBox">
          <div class="card-tit1">今日待办 (条)</div>
          <div class="card-tit2 animate__animated animate__fadeInDown">
            {{ completionStatus.finishCount }}<span> / </span
            >{{ completionStatus.total }}
          </div>
          <div class="card-tit3">已完成<span> / </span>全部</div>
        </div>
        <div class="historyTask snowBox">
          <div class="card-tit1">完成度 (%)</div>
          <div>
            <div class="card-tit2 animate__animated animate__fadeInDown">
              {{
                isNaN(completionStatus.percent) ? 0 : completionStatus.percent
              }}%
            </div>
            <van-progress
              style="top: 0.65rem"
              :show-pivot="false"
              :percentage="completionStatus.percent"
              stroke-width="8"
              track-color="#ddd"
            />
          </div>
        </div>
      </div>
      <!-- 待办类型占比饼图 -->
      <div class="box2 snowBox">
        <div class="title" style="margin-bottom: 2%">待办类型占比</div>
        <PieChart class="chart" />
      </div>
      <!-- 待办时长分布折线图 -->
      <div class="box3 snowBox">
        <div class="title">本月待办时长分布</div>
        <LineChart class="chart" />
      </div>
      <!-- 专注时间散点图 -->
      <div class="box4 snowBox">
        <div class="title">专注时间散点图</div>
        <ScatterChart class="chart" />
      </div>
      <!-- 本周完成度水球图 -->
      <div class="box5 snowBox">
        <div class="title">本周完成情况</div>
        <WaterBallChart class="chart" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import request from "@/utils/request";
import dayjs from "dayjs";
import { API_LIST } from "@/constants/api";
import { TODO_TYPE } from "@/constants/task";
import type { ITask } from "@/types";
import { Notify } from "vant";
import WaterBallChart from "@/components/Chart/WaterBallChart.vue";
import ScatterChart from "@/components/Chart/ScatterChart.vue";
import PieChart from "@/components/Chart/PieChart.vue";
import LineChart from "@/components/Chart/LineChart.vue";

//今日完成度
const completionStatus = reactive({
  finishCount: 0,
  total: 0,
  percent: 0,
});

/* ================================================================================================
 * 🍊 @description: 待办完成度获取和处理
 * 🍊 @Date: 2022-02-06 15:45:21
================================================================================================ */
const getCompletionStatus = async () => {
  const res = await request.post(API_LIST.GET_TASK_DATA, {
    time: dayjs(new Date()).format("YYYY-MM-DD"),
    type: TODO_TYPE.TASK,
  });
  if (!res || !res?.data) {
    Notify({ type: "danger", message: "获取待办完成度数据失败" });
  }
  completionStatus.finishCount = res?.data.reduce(
    (accumulator: number, currentValue: ITask) => {
      if (currentValue?.finish) accumulator++;
      return accumulator;
    },
    0,
  );
  completionStatus.total = res?.data.length;
  completionStatus.percent = Math.trunc(
    (completionStatus.finishCount / completionStatus.total) * 100,
  );
};

onMounted(async () => {
  await getCompletionStatus();
});
</script>

<style lang="scss" scoped>
.dataStatisticsPage {
  position: relative;
  height: 100%;
  width: 100%;
  background-image: url("@/assets/img/background.jpg");
  background-size: 100% 100%;
  overflow-y: scroll;
}
.content {
  position: relative;
  margin-top: 2vh;
  width: 100%;
  margin-bottom: 4vh;
  .box1 {
    display: flex;
    margin-top: 6vh;
    margin-left: 6vw;
    width: 88vw;
    justify-content: space-between;
    .todayTask,
    .historyTask {
      position: relative;
      flex-basis: 42%;
      padding: 2vw;
      box-shadow: 0 0 8px 6px rgba(32, 32, 34, 0.03);
      border-radius: 18px;
      background-color: rgba(255, 255, 255, 0.6);
    }
    .card-tit1 {
      font-size: 0.9rem;
    }
    .card-tit2 {
      margin-top: 1vh;
      margin-bottom: 1vh;
      margin-left: 0.4rem;
      font-size: 3rem;
      span {
        font-size: 1rem;
      }
    }
    .card-tit3 {
      font-size: 1rem;
      color: #666666;
    }
  }
  .box2,
  .box3,
  .box4,
  .box5 {
    margin-top: 4vh;
    margin-left: 6vw;
    width: 79vw;
    height: 28vh;
    overflow: hidden;
    padding: 4vw;
    box-shadow: 0 0 8px 6px rgba(32, 32, 34, 0.03);
    background-color: rgba(255, 255, 255, 0.6);
    .title {
      position: relative;
      height: 10%;
      width: 100%;
    }
    .chart {
      position: relative;
      width: 100%;
      height: 90%;
    }
  }
}
.btnGroup {
  position: relative;
  display: inline;
  border: #666666 1px solid;
  padding-top: 1vw;
  padding-bottom: 1vw;
  .btnGroup-btn {
    padding: 1vw;
  }
  .btnGroup-btn:active {
    background-color: red;
  }
}
</style>
