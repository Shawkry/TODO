<template>
  <div class="scatter-chart" ref="scatterChartRef"></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import request from "@/utils/request";
import dayjs from "dayjs";
import * as echarts from "echarts";
import { API_LIST } from "@/constants/api";
import { TODO_TYPE } from "@/constants/task";
import { Notify } from "vant";
import type { ITask } from "@/types";
import { SCATTER_OPTIONS } from "@/constants/chartOptions";

const myChart = ref();
const scatterChartRef = ref();
/* ================================================================================================
 * 🍊 @description: 初始化专注散点图
 * 🍊 @Date: 2022-02-11 22:26:18
================================================================================================ */
const initScatterChart = async () => {
  const res = await request.post(API_LIST.GET_TASK_DATA, {
    time: dayjs(new Date()).format("YYYY-MM-DD"),
    type: TODO_TYPE.FOCUS,
  });
  if (!res || !res?.data) {
    return Notify({ type: "danger", message: "获取每日专注数据失败" });
  }
  const data = res.data.map((item: ITask) => {
    return [Number(dayjs(item.time).format("HH")), item.workTime];
  });
  const option = {
    ...SCATTER_OPTIONS,
    series: {
      ...SCATTER_OPTIONS.series,
      data: data,
    },
  };
  myChart.value.setOption(option);
};
/* ================================================================================================
 * 🍊 @description: 初始化图表数据
 * 🍊 @Date: 2022-02-06 12:02:46
================================================================================================ */
const initCharts = async () => {
  myChart.value = echarts.init(scatterChartRef.value);
  await initScatterChart();
};
onMounted(async () => {
  await initCharts();
});
</script>
