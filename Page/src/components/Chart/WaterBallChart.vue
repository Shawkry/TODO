<template>
  <div class="water-ball-chart" ref="waterBallChartRef"></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import request from "@/utils/request";
import dayjs from "dayjs";
import * as echarts from "echarts";
import "echarts-liquidfill";
import { API_LIST } from "@/constants/api";
import { TODO_TYPE } from "@/constants/task";
import { WATER_BALL_OPTIONS } from "@/constants/chartOptions";
import { Notify } from "vant";

interface weekFinishRespondData {
  finish: number;
  total: number;
  completeness: number;
}
const waterBallChartRef = ref();
const myChart = ref();
/* ================================================================================================
 * 🍊 @description: 获取水球图提示
 * 🍊 @Date: 2022-02-06 17:52:02
================================================================================================ */
const getTooltipFormatter = (
  task: weekFinishRespondData,
  summary: weekFinishRespondData,
  params: { seriesId: string },
) => {
  const todoType = Number(params.seriesId);
  const todoItem = todoType === TODO_TYPE.TASK ? task : summary;
  const info = {
    finishCount: todoItem.finish,
    total: todoItem.total,
    unFinishCount: todoItem.total - todoItem.finish,
    unit: todoType === TODO_TYPE.TASK ? "(条)" : "(天)",
  };
  return `<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#1598ED;\"></span>
            已完成${info.unit}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${info.finishCount}</br></br>
            <span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#f56c6c;\"></span>
            未完成${info.unit}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${info.unFinishCount}`;
};
/* ================================================================================================
 * 🍊 @description: 完成情况水球图
 * 🍊 @Date: 2022-02-06 18:52:52
================================================================================================ */
const initWaterBallChart = async () => {
  const res = await request.post(API_LIST.GET_WATER_BALL_CHART_DATA, {
    startTime: dayjs(new Date()).startOf("week").format("YYYY-MM-DD"),
    endTime: dayjs(new Date()).add(1, "day").format("YYYY-MM-DD"),
  });
  if (!res || !res?.data) {
    return Notify({ type: "danger", message: "网络错误" });
  }
  const { task, summary } = res.data as {
    task: weekFinishRespondData;
    summary: weekFinishRespondData;
  };
  const taskData = [
    task.completeness,
    task.completeness - 0.2,
    task.completeness - 0.1,
  ];
  const summaryData = [
    summary.completeness,
    summary.completeness - 0.2,
    summary.completeness - 0.1,
  ];
  const option = {
    ...WATER_BALL_OPTIONS,
    tooltip: {
      trigger: "item",
      formatter: (params: { seriesId: string }) =>
        getTooltipFormatter(task, summary, params),
    },
    series: [
      {
        ...WATER_BALL_OPTIONS.series[0],
        data: taskData,
      },
      { ...WATER_BALL_OPTIONS.series[1], data: summaryData },
    ],
  };
  myChart.value.setOption(option);
};
/* ================================================================================================
 * 🍊 @description: 初始化图表数据
 * 🍊 @Date: 2022-02-06 12:02:46
================================================================================================ */
const initCharts = async () => {
  myChart.value = echarts.init(waterBallChartRef.value);
  await initWaterBallChart();
};
onMounted(async () => {
  await initCharts();
});
</script>
