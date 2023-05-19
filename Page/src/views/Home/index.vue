<!-- 
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-02 17:45:37
 * ⭐ @LastEditTime: 2022-02-11 22:08:02
 * ⭐ @Description: home界面
 -->
<template>
  <div class="main">
    <div class="page">
      <router-view></router-view>
    </div>
    <div class="tabBar">
      <TabBar></TabBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TabBar from "./tabBar.vue";
const active = ref("dailyPlan");
</script>

<style lang="scss" scoped>
.main {
  /* color: ghostwhite; */
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.page {
  position: absolute;
  height: 91%;
  width: 100%;
  /*background-color: #51d5c2;*/
}
.container {
  max-width: none;
}
.tabBar {
  position: absolute;
  bottom: 0;
  height: 9%;
  width: 100%;
}
</style>
