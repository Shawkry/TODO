<!-- 
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-08 19:05:37
 * ⭐ @LastEditTime: 2022-04-26 10:24:15
 * ⭐ @Description: 时间组件
 -->
<template>
  <div class="clock">
    <div class="week">
      <span
        v-for="value in weekArr"
        :key="value"
        :class="{ weekActive: value === week }"
        >{{ value }}</span
      >
    </div>
    <div class="time">
      <span class="timeTxt">{{ time }}</span>
      <span class="timeTxt2">{{ ampm }}</span>
    </div>
    <div class="date">{{ date }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import dayjs from "dayjs";
const weekArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const time = ref();
const date = ref();
const ampm = ref();
const week = ref();
const interval = ref();
onMounted(() => {
  const getTime = () => {
    const newDate = new Date();
    time.value = dayjs(newDate).format("hh:mm:ss");
    date.value = dayjs(newDate).format("YYYY - MM - DD");
    ampm.value = dayjs(newDate).format("A");
    week.value = weekArr[newDate.getDay()];
    return getTime;
  };
  interval.value = setInterval(getTime(), 1000);
});
onBeforeUnmount(() => {
  clearInterval(interval.value);
});
</script>

<style lang="scss" scoped>
.clock {
  position: relative;
  width: 100%;
  height: 100%;
  //   display: flex;
  .week {
    font: 0.7rem Arial, sans-serif;
    // padding: 2vw;
    height: 25%;
    display: flex;
    margin: auto;
    width: 70%;
    color: #bbb;
    // flex-direction: column;
    .weekActive {
      color: #000;
    }
    span {
      flex: 1;
      margin: auto;
      //   line-height: 50%;
    }
  }
  .time {
    flex: 1;
    color: #759aa0;
    position: relative;
    height: 50%;
    font-size: 3rem;
    // padding: 3vw;
    text-align: center;
    .timeTxt {
      font-family: "TimeFont", serif;
    }
    .timeTxt2 {
      font: 0.5rem Arial, sans-serif;
      margin-left: 1rem;
    }
  }
  .date {
    margin-top: 0.4rem;
    color: #759aa0;
    position: relative;
    font-family: "TimeFont", serif;
    height: 15%;
    text-align: center;
    font-size: 1.5rem;
  }
}
</style>
