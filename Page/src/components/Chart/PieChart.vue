<template>
  <div>
    <span style="position: absolute; right: 2vw; z-index: 999">
      <el-select
        v-model="selectValue"
        style="width: 4.8rem !important"
        placeholder="Select"
        size="small"
        @change="
          (value: string) => {
            initPieChart(value);
          }
        "
      >
        <el-option
          v-for="item in ['day', 'week', 'month']"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </span>
    <div class="pie-chart" ref="pieChartRef"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import request from "@/utils/request";
import dayjs from "dayjs";
import * as echarts from "echarts";
import { API_LIST } from "@/constants/api";
import { Notify } from "vant";
import { PIE_OPTIONS } from "@/constants/chartOptions";
const selectValue = ref<string>("day");
const pieChartRef = ref();
const myChart = ref();
/* ================================================================================================
 * 🍊 @description: 待办类型占比饼图
 * 🍊 @Date: 2022-02-06 15:19:34
================================================================================================ */
const initPieChart = async (dateRange: any = "day") => {
  const res = await request.post(API_LIST.GET_TASK_TYPE_DATA, {
    start: dayjs(new Date()).startOf(dateRange).format("YYYY-MM-DD"),
    end: dayjs(new Date()).endOf(dateRange).add(1, "day").format("YYYY-MM-DD"),
  });
  if (!res || !res?.data) {
    return Notify({ type: "danger", message: "网络错误" });
  }
  const option = {
    ...PIE_OPTIONS,
    series: {
      ...PIE_OPTIONS.series,
      data: res.data,
    },
  };
  myChart.value.setOption(option);
};
/* ================================================================================================
 * 🍊 @description: 初始化图表数据
 * 🍊 @Date: 2022-02-06 12:02:46
================================================================================================ */
const initCharts = async () => {
  myChart.value = echarts.init(pieChartRef.value);
  await initPieChart();
};

onMounted(async () => {
  await initCharts();
});
</script>
<style lang="scss" scoped>
.pie-chart {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
