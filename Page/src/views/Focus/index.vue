<!-- 
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-08 16:15:21
 * ⭐ @LastEditTime: 2022-04-26 10:35:29
 * ⭐ @Description: 专注模式模块
 -->
<template>
  <div class="focus">
    <div class="content">
      <div class="box1 snowBox">
        <Clock class="clock animate__animated animate__flipInX" />
      </div>
      <div class="box2 snowBox animate__animated animate__bounceIn">
        <div class="selectTask">
          <div class="selectTaskBox">
            <el-dropdown
              style="
                width: 100% !important;
                height: 100% !important;
                align-items: center !important;
                text-align: center !important;
              "
              @command="checkTask"
            >
              <span
                class="el-dropdown-link van-ellipsis"
                style="width: 100% !important; font-size: 1rem; cursor: pointer"
              >
                {{ selectTaskValue.message }}
                <van-icon name="arrow-down"></van-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in taskList"
                    :key="item.message"
                    :label="item.message"
                    :value="item.message"
                    :command="item"
                    >{{ item.message }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div class="time">
          <Pomodoro :selectTaskValue="selectTaskValue" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import dayjs from "dayjs";
import { Notify } from "vant";
import request from "@/utils/request";
import { API_LIST } from "@/constants/api";
import { TODO_TYPE } from "@/constants/task";
import { NOTIFY_TYPE } from "@/constants/code";
import Clock from "../../components/Clock/index.vue";
import Pomodoro from "../../components/Pomodoro/index.vue";
import type { ITask } from "@/types";
const selectTaskValue = reactive({
  message: "专注事件",
  id: "",
});
const taskList = ref<ITask[]>([]);

/* ================================================================================================
 * 🍊 @description: 选择任务
 * 🍊 @Date: 2022-02-09 11:09:55
================================================================================================ */
const checkTask = (task: { id: string; message: string }) => {
  selectTaskValue.message = task.message;
  selectTaskValue.id = task.id;
};
/* ================================================================================================
 * 🍊 @description: 获取今日待办
 * 🍊 @Date: 2022-02-09 11:13:55
================================================================================================ */
const getData = async () => {
  const res = await request.post(API_LIST.GET_TASK_DATA, {
    time: dayjs(new Date()).format("YYYY-MM-DD"),
    type: TODO_TYPE.TASK,
  });
  if (!res || !res?.data) {
    return Notify({ type: NOTIFY_TYPE.DANGER, message: "网络错误" });
  }
  taskList.value = res.data
    .filter((task: ITask) => !task?.finish)
    ?.map((task: ITask) => {
      return { message: task.message, id: task._id, finish: task.finish };
    });
};
onMounted(async () => {
  await getData();
});
watch(selectTaskValue, async () => {
  await getData();
});
</script>

<style lang="scss" scoped>
.focus {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(@/assets/img/background.jpg);
  background-size: 100% 100%;
}
.content {
  position: relative;
  width: 100%;
  height: 100%;
  top: 6%;
  .box1 {
    position: relative;

    margin: 0 auto;
    height: 20%;
    width: 90%;
  }
  .box2 {
    position: relative;
    margin: 3rem auto;
    height: 62%;
    width: 90%;
    background-color: rgba(255, 255, 255, 0.5);
    .selectTask {
      position: relative;
      height: 10%;
      width: 100%;
      .selectTaskBox {
        width: 60%;
        height: 100%;
        margin: 0 auto;
      }
    }
    .time {
      position: relative;
      height: 88%;
      width: 100%;
    }
  }
}
</style>
