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
            {{ completion.finish }}<span> / </span>{{ completion.all }}
          </div>
          <div class="card-tit3">已完成<span> / </span>全部</div>
        </div>
        <div class="historyTask snowBox">
          <div class="card-tit1">完成度 (%)</div>
          <div>
            <div class="card-tit2 animate__animated animate__fadeInDown">
              {{ isNaN(completion.percent) ? 0 : completion.percent }}%
            </div>
            <van-progress
              style="top: 0.65rem"
              :show-pivot="false"
              :percentage="completion.percent"
              stroke-width="8"
              track-color="#ddd"
            />
          </div>
        </div>
      </div>
      <!-- 待办类型占比饼图 -->
      <div class="box2 snowBox">
        <div class="title" style="margin-bottom: 2%">待办类型占比</div>
        <span style="position: absolute; right: 6vw; z-index: 999">
          <el-select
            v-model="selectValue"
            style="width: 4.5rem !important"
            placeholder="Select"
            size="small"
            @change="
              (value:string) => {
                initTypeChart(value);
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
        <div class="typeChart" ref="typeChartRef"></div>
      </div>
      <!-- 待办时长分布折线图 -->
      <div class="box3 snowBox">
        <div class="title">本月待办时长分布</div>
        <span style="position: absolute; right: 6vw; z-index: 999">
          <el-button-group size="small">
            <el-button type="primary" @click="initTimeChart('min')"
              >分钟</el-button
            >
            <el-button type="primary" @click="initTimeChart('hour')"
              >小时</el-button
            >
          </el-button-group>
        </span>
        <div class="timeChart" ref="timeChartRef"></div>
      </div>
      <!-- 专注时间散点图 -->
      <div class="box4 snowBox">
        <div class="title">专注时间散点图</div>
        <div class="facusChart" ref="facusChartRef"></div>
      </div>
      <!-- 本周完成度水球图 -->
      <div class="box5 snowBox">
        <div class="title">本周完成情况</div>
        <div class="waterBallChart" ref="waterBallChartRef"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import request from "@/common/request";
import dayjs from "dayjs";
import * as echarts from "echarts";
import "echarts-liquidfill";

const typeChartRef = ref<any>(); //类型占比饼图Dom ref
const waterBallChartRef = ref<any>(); //完成度水球图Dom ref
const timeChartRef = ref<any>(); //时间占比折线图Dom ref
const facusChartRef = ref<any>();
const selectValue = ref<any>("day");
//今日完成度
const completion = reactive({
  finish: 0,
  all: 0,
  percent: 0,
});
const myChart: any = reactive({
  typeChart: null,
  timeChart: null,
  waterBallChart: null,
  facusChart: null,
});
/* ================================================================================================
 * 🍊 @description: 完成情况水球图
 * 🍊 @Date: 2022-02-06 18:52:52
================================================================================================ */
const initWaterBallChart = () => {
  request
    .post("/getWaterBallChartData", {
      startTime: dayjs(new Date()).startOf("week").format("YYYY-MM-DD"),
      endTime: dayjs(new Date()).add(1, "day").format("YYYY-MM-DD"),
    })
    .then((res: any) => {
      const { task, summary } = res;
      const option = {
        title: [
          {
            text: "每日待办完成度",
            left: "4%",
            bottom: "15%",
            textStyle: {
              fontSize: "1%",
              textAlign: "center",
            },
          },
          {
            text: "每日总结完成度",
            right: "4%",
            bottom: "15%",
            textStyle: {
              fontSize: "1%",
              textAlign: "center",
            },
          },
        ],
        tooltip: {
          trigger: "item",
          formatter: function (params: any) {
            let tmp;
            if (params.seriesName === "每日待办完成度") {
              tmp = [task.finish, task.total, res.task[2], "(条)"];
            } else {
              tmp = [summary.finish, summary.total, res.summary[2], "(天)"];
            }
            return `<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#1598ED;\"></span>
            已完成${tmp[3]}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${tmp[0]}</br></br>
            <span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#f56c6c;\"></span>
            未完成${tmp[3]}&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp${tmp[1] - tmp[0]}`;
          },
        },
        series: [
          {
            type: "liquidFill",
            name: "每日待办完成度",
            data: [
              task.completeness,
              task.completeness - 0.2,
              task.completeness - 0.1,
            ],
            // color: ["#1598ED", "#1598ED", "#45BDFF"],
            color: ["#1895e9", "#1682ca", "#53a8ff"],
            radius: "50%",
            center: ["20%", "40%"],
            outline: {
              show: false,
            },
            label: {
              fontSize: 28,
              position: ["50%", "50%"],
            },
            borderDistance: 0,
            itemStyle: {
              borderWidth: 3,
              borderColor: "#156ACF",
              shadowBlur: 20,
              shadowColor: "rgba(0, 0, 0, 0.4)",
            },
          },
          {
            type: "liquidFill",
            name: "每日总结完成度",
            data: [
              summary.completeness,
              summary.completeness - 0.2,
              summary.completeness - 0.1,
            ],
            color: ["#1895e9", "#1682ca", "#53a8ff"],
            radius: "50%",
            center: ["80%", "40%"],
            outline: {
              show: false,
            },
            label: {
              fontSize: 28,
              position: ["50%", "50%"],
            },
            borderDistance: 0,
            itemStyle: {
              borderWidth: 3,
              borderColor: "#156ACF",
              shadowBlur: 20,
              shadowColor: "rgba(0, 0, 0, 0.4)",
            },
          },
        ],
      };
      myChart.waterBallChart.setOption(option);
    });
};
/* ================================================================================================
 * 🍊 @description: 待办类型占比饼图
 * 🍊 @Date: 2022-02-06 15:19:34
================================================================================================ */
const initTypeChart = (dateRange: any = "day") => {
  request
    .post("getTaskTypeData", {
      start: dayjs(new Date()).startOf(dateRange).format("YYYY-MM-DD"),
      end: dayjs(new Date())
        .endOf(dateRange)
        .add(1, "day")
        .format("YYYY-MM-DD"),
    })
    .then((res: any) => {
      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "待办类型",
            type: "pie",
            radius: "50%",
            center: ["60%", "60%"],
            data: res,
            emphasis: {
              itemStyle: {
                shadowBlur: 5,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      myChart.typeChart.setOption(option);
    });
};
/* ================================================================================================
 * 🍊 @description: 时间占比折线图
 * 🍊 @Date: 2022-02-07 14:11:20
================================================================================================ */
const initTimeChart = (type: string = "min") => {
  const myChart = echarts.init(timeChartRef.value);
  request
    .post("getTimeChartData", {
      time: dayjs(new Date()).format("YYYY-MM-DD"),
    })
    .then((res: any) => {
      const thisMonth = dayjs(new Date()).format("MM");
      const dateList = res.map((item: number, index: number) => {
        return `${thisMonth}-${index < 10 ? "0" : ""}${index + 1}`;
      });
      const minutesValue = res;
      const hoursValue = res.map((item: number) => {
        return Number((item / 60).toFixed(1));
      });
      const option = {
        tooltip: {
          trigger: "axis",
          position: function (pt: any) {
            return [pt[0], "10%"];
          },
          confine: true,
        },
        grid: {
          containLabel: true,
          //   x: "12%",
          x: "0%",
          y: "20%",
          bottom: "10%",
        },
        xAxis: {
          data: dateList,
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          name: "时间(分钟)",
          boundaryGap: [0, "100%"],
        },

        series: [
          {
            name: "当日时长(分钟)",
            type: "line",
            smooth: true,
            symbol: "none",
            areaStyle: {},
            // data: res.valueList,
            data: minutesValue,
          },
        ],
      };
      if (type === "hour") {
        const option2: any = {
          tooltip: {
            trigger: "axis",
            position: function (pt: any) {
              return [pt[0], "10%"];
            },
            confine: true,
          },
          xAxis: {
            data: res.dateList,
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            type: "value",
            name: "时间(小时)",
          },
          series: [
            {
              name: "当日时长(小时)",
              type: "bar",
              data: hoursValue,
              emphasis: {
                focus: "series",
              },
              animationDelay: function (idx: any) {
                return idx * 10;
              },
            },
          ],
          animationEasing: "elasticOut",
          animationDelayUpdate: function (idx: any) {
            return idx * 5;
          },
        };
        myChart.setOption(option2);
      } else {
        myChart.setOption(option);
      }
    });
};
/* ================================================================================================
 * 🍊 @description: 初始化专注散点图
 * 🍊 @Date: 2022-02-11 22:26:18
================================================================================================ */
const initFacusChart = () => {
  request
    .post("getData", {
      time: dayjs(new Date()).format("YYYY-MM-DD"),
      mode: "3",
    })
    .then((res: any) => {
      const data = res.map((item: any) => {
        return [dayjs(item.time).format("HH"), item.workTime];
      });
      const option = {
        tooltip: {
          trigger: "item",
          confine: true,
          formatter: function (param: any) {
            return (
              `<span style=\"display:inline-block;margin-right:4px;border-radius:10px;
            width:10px;height:10px;background-color:#5470c6;\"></span>开始时间` +
              `&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp` +
              param.value[0] +
              `</br></br><span style=\"display:inline-block;margin-right:4px;border-radius:10px;
                    width:10px;height:10px;background-color:#fc8452;\"></span>持续时长` +
              `&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp` +
              param.value[1]
            );
          },
        },
        grid: {
          x: "6%",
          y: "20%",
          bottom: "10%",
          right: "12%",
          containLabel: true,
        },
        xAxis: {
          //   data: res.dateList,
          name: "时间/h",
          data: [
            7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            1, 2, 3, 4, 5, 6,
          ],
          //   type: "time",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          name: "时长(min)",
          boundaryGap: [0, "100%"],
        },

        series: [
          {
            symbolSize: 13,
            data: data,
            type: "scatter",
            color: "#91cc75",
          },
        ],
      };

      myChart.facusChart.setOption(option);
    });
};
/* ================================================================================================
 * 🍊 @description: 初始化图表数据
 * 🍊 @Date: 2022-02-06 12:02:46
================================================================================================ */
const initCharts = () => {
  myChart.typeChart = echarts.init(typeChartRef.value);
  //   myChart.timeChart = echarts.init(timeChartRef.value);
  myChart.waterBallChart = echarts.init(waterBallChartRef.value);
  myChart.facusChart = echarts.init(facusChartRef.value);
  initTypeChart();
  initWaterBallChart();
  initFacusChart();
  initTimeChart();
};
/* ================================================================================================
 * 🍊 @description: 待办完成度获取和处理
 * 🍊 @Date: 2022-02-06 15:45:21
================================================================================================ */
const getCompletion = () => {
  request
    .post("getData", {
      time: dayjs(new Date()).format("YYYY-MM-DD"),
      mode: "1",
    })
    .then((res: any) => {
      res.forEach((element: any) => {
        element.finish ? completion.finish++ : null;
      });
      completion.all = res.length;
      completion.percent = Math.trunc(
        (completion.finish / completion.all) * 100
      );
    });
};
onMounted(() => {
  getCompletion();
  initCharts();
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
  //   background-image: linear-gradient(
  //     to bottom,
  //     #8ec3ec,
  //     #9fc8eb,
  //     #afceea,
  //     #bed3e8,
  //     #ccd9e7
  //   );
}
.content {
  position: relative;
  margin-top: 2vh;
  width: 100%;
  //   height: 100%;
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
      //   height: 10vh;
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
    .typeChart,
    .waterBallChart,
    .timeChart,
    .facusChart {
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
    // border: #666666 1px solid;
  }
  .btnGroup-btn:active {
    background-color: red;
  }
}
</style>
