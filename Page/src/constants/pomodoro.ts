export enum CONVERT_TIME_TYPE {
  TO_STRING = 1,
  TO_NUMBER,
}
export const INIT_TIME_TITLE = "00:00:00";

export const POMODORO_OPTIONS = {
  title: {
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
