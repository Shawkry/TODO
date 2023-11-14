import { TODO_TYPE } from "@/constants/task";

export const PIE_OPTIONS = {
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: {
    name: "待办类型",
    type: "pie",
    radius: "50%",
    center: ["60%", "60%"],
    emphasis: {
      itemStyle: {
        shadowBlur: 5,
        shadowOffsetX: 0,
        shadowColor: "rgba(0, 0, 0, 0.5)",
      },
    },
  },
};
export const LINE_OPTIONS_MIN_TYPE = {
  tooltip: {
    trigger: "axis",
    position: (pt: any) => {
      return [pt[0], "10%"];
    },
    confine: true,
  },
  grid: {
    containLabel: true,
    x: "2%",
    y: "20%",
    bottom: "10%",
  },
  xAxis: {
    boundaryGap: false,
  },
  yAxis: {
    type: "value",
    name: "时间(分钟)",
    boundaryGap: [0, "100%"],
  },
  series: {
    name: "当日时长(分钟)",
    type: "line",
    smooth: true,
    symbol: "none",
    areaStyle: {},
  },
};
export const LINE_OPTIONS_HOUR_TYPE = {
  tooltip: {
    trigger: "axis",
    position: (pt: any) => {
      return [pt[0], "10%"];
    },
    confine: true,
  },
  xAxis: {
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    type: "value",
    name: "时间(小时)",
  },
  grid: {
    containLabel: true,
    x: "2%",
    y: "20%",
    bottom: "10%",
    left: "5%",
  },
  series: {
    name: "当日时长(小时)",
    type: "bar",
    emphasis: {
      focus: "series",
    },
    animationDelay: (idx: number) => {
      return idx * 10;
    },
  },
  animationEasing: "elasticOut" as any,
  animationDelayUpdate: (idx: number) => {
    return idx * 5;
  },
};
export const SCATTER_OPTIONS = {
  tooltip: {
    trigger: "item",
    confine: true,
    formatter: (param: any) => {
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
    x: "2%",
    y: "20%",
    bottom: "10%",
    right: "17%",
    containLabel: true,
  },
  xAxis: {
    name: "时间/h",
    data: [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
      21, 22, 23,
    ],
    boundaryGap: false,
  },
  yAxis: {
    type: "value",
    name: "时长(min)",
    boundaryGap: [0, "100%"],
  },
  series: {
    symbolSize: 13,
    type: "scatter",
    color: "#91cc75",
  },
};
export const WATER_BALL_OPTIONS = {
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
  },
  series: [
    {
      id: TODO_TYPE.TASK,
      type: "liquidFill",
      name: "每日待办完成度",
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
      id: TODO_TYPE.SUMMARY,
      type: "liquidFill",
      name: "每日总结完成度",
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
