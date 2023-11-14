<template>
  <div>
    <span style="position: absolute; right: 2vw; z-index: 999">
      <el-button-group size="small">
        <el-button type="primary" @click="initLineChart('min')">分钟</el-button>
        <el-button type="primary" @click="initLineChart('hour')"
          >小时</el-button
        >
      </el-button-group>
    </span>
    <div class="line-chart" ref="lineChartRef"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import request from "@/utils/request";
import dayjs from "dayjs";
import * as echarts from "echarts";
import { API_LIST } from "@/constants/api";
import { Notify } from "vant";
import {
  LINE_OPTIONS_HOUR_TYPE,
  LINE_OPTIONS_MIN_TYPE,
} from "@/constants/chartOptions";

const lineChartRef = ref();
const myChart = ref();
/* ================================================================================================
 * 🍊 @description: 时间占比折线图
 * 🍊 @Date: 2022-02-07 14:11:20
================================================================================================ */
const initLineChart = async (type: string = "min") => {
  const res = await request.post(API_LIST.GET_TIME_CHART_DATA, {
    time: dayjs(new Date()).format("YYYY-MM-DD"),
  });
  if (!res || !res?.data) {
    return Notify({ type: "danger", message: "网络错误" });
  }
  const thisMonth = dayjs(new Date()).format("MM");
  const dateList = res.data.map((item: number, index: number) => {
    return `${thisMonth}-${index < 10 ? "0" : ""}${index + 1}`;
  });
  const minutesValue = res.data;
  const hoursValue = res.data.map((item: number) => {
    return Number((item / 60).toFixed(1));
  });
  const minTypeOption = {
    ...LINE_OPTIONS_MIN_TYPE,
    xAxis: {
      data: dateList,
      boundaryGap: false,
    },
    series: {
      ...LINE_OPTIONS_MIN_TYPE.series,
      data: minutesValue,
    },
  };
  const hourTypeOption = {
    ...LINE_OPTIONS_HOUR_TYPE,
    xAxis: {
      data: dateList,
      boundaryGap: false,
    },
    series: {
      ...LINE_OPTIONS_HOUR_TYPE.series,
      data: hoursValue,
    },
  };
  myChart.value.setOption(type === "min" ? minTypeOption : hourTypeOption);
};
const initCharts = async () => {
  myChart.value = echarts.init(lineChartRef.value);
  await initLineChart();
};

onMounted(async () => {
  await initCharts();
});
</script>
<style lang="scss" scoped>
.line-chart {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
