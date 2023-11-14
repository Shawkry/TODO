<!-- 
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-03 19:47:50
 * ⭐ @LastEditTime: 2022-02-28 18:34:31
 * ⭐ @Description: 每日待办模块
 -->
<template>
  <div class="main">
    <!-- 时间查找 -->
    <div style="position: relative; width: 100%; height: 3rem">
      <span
        style="
          position: relative;
          right: 0;
          color: white;
          padding: 1rem;
          float: right;
          text-shadow:
            #000 1px 0 0,
            #000 0 1px 0;
        "
        @click="showTime = true"
      >
        时间查找
      </span>
    </div>
    <!-- 主要内容 -->
    <div class="snowBox box1">
      <!-- 每日待办 -->
      <van-swipe-cell v-for="(item, index) in data.list" :key="index">
        <van-cell
          :border="false"
          class="animate__animated animate__fadeInRight"
        >
          <template #icon="props"></template>
          <template #title>
            <van-checkbox v-model="item.finish" @click="finishTask(item)">
              <span :class="{ line: item.finish }">{{
                item.message
              }}</span></van-checkbox
            >
          </template>
          <template #value>
            {{ item.tag }}
          </template>
        </van-cell>
        <template #right>
          <van-button
            square
            text="删除"
            color="#ee6666"
            style="height: 100% !important"
            @click="deleteTask(item)"
          />
          <van-button
            square
            text="修改"
            color="#5470c6"
            style="height: 100% !important"
            @click="
              () => {
                showPopup = true;
                taskForm.message = item.message;
                taskForm.tag = item.tag;
                taskForm.workTime = item.workTime;
                updateItem = item._id ?? null;
              }
            "
          />
        </template>
      </van-swipe-cell>
      <!-- 新增待办按钮 -->
      <div style="display: flex; margin-top: 10px; margin-bottom: 10px">
        <van-button
          icon="plus"
          round
          size="small"
          style="margin: 0 auto"
          @click="showPopup = true"
        />
      </div>
    </div>
    <!-- 每日总结 -->
    <div
      class="snowBox box2"
      style="background-color: rgba(255, 255, 255, 0.4) !important"
    >
      <van-field
        v-model="summary.message"
        style="background: none !important"
        rows="8"
        autosize
        label="总结"
        type="textarea"
        readonly
        show-word-limit
        @click="showDialog = true"
        label-width="4rem"
        class="animate__animated animate__fadeInUp"
      />
    </div>
    <!-- 提交待办表单弹窗 -->
    <van-popup
      v-model:show="showPopup"
      position="top"
      @closed="
        () => {
          updateItem = null;
          taskForm.message = '';
          taskForm.tag = '';
          taskForm.workTime = '';
        }
      "
    >
      <van-form @submit="submitTaskForm">
        <van-cell-group inset>
          <van-field
            v-model="taskForm.message"
            name="message"
            label="待办"
            placeholder="请填写待办信息"
            :rules="[{ required: true, message: '请填写待办信息' }]"
          />
          <van-field
            v-model="taskForm.workTime"
            name="message"
            label="时长（分钟）"
            placeholder="请填写待办时长"
            :rules="[
              { required: true, message: '请填写待办时长(分钟）' },
              {
                pattern: /^\d{0,3}$/,
                message: '请以分钟为单位填写三位数以内的数字！',
              },
            ]"
          />
          <van-field
            v-model="taskForm.tag"
            is-link
            readonly
            label="类型"
            :rules="[{ required: true, message: '请填写待办类型' }]"
            placeholder="请选择待办类型"
            @click="showTagPicker = true"
          />
        </van-cell-group>
        <div style="margin: 15px">
          <van-button round block type="primary" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </van-popup>
    <!-- 编辑每日总结弹窗 -->
    <van-dialog
      v-model:show="showDialog"
      style="overflow: hidden"
      title="每日总结"
      show-cancel-button
      @confirm="uploadSummary"
      confirmButtonColor="#91b185"
      cancelButtonColor="#aaa"
    >
      <van-field
        v-model="summary.message"
        rows="5"
        type="textarea"
        placeholder="请输入总结"
        show-word-limit
      />
    </van-dialog>
    <!-- 时间选择弹窗 -->
    <van-popup
      v-model:show="showTime"
      position="bottom"
      :style="{ height: '43%' }"
    >
      <van-datetime-picker
        v-model="currentDate"
        cancel-button-text="回到当天"
        type="month-day"
        title="选择月日"
        :formatter="formatTimeSelect"
        @confirm="timeSelect"
        @cancel="
          () => {
            currentDate = new Date();
            getData();
            showTime = false;
          }
        "
      />
    </van-popup>
    <!-- 待办类型选择弹窗 -->
    <van-popup v-model:show="showTagPicker" round position="bottom">
      <van-picker
        :columns="TAG_LIST"
        @cancel="showTagPicker = false"
        @confirm="
          (value) => {
            taskForm.tag = value;
            showTagPicker = false;
          }
        "
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Notify } from "vant";
import dayjs from "dayjs";
import request from "@/utils/request";
import { TAG_LIST, TAG_TYPE, TODO_TYPE } from "@/constants/task";
import { API_LIST } from "@/constants/api";
import { NOTIFY_TYPE } from "@/constants/code";
import { TIME_CONSTANTS } from "@/constants/date";
import type { ITask } from "@/types";

const showTagPicker = ref<boolean>(false); //显示待办类型选择弹窗
const showTime = ref<boolean>(false); //显示时间选转弹窗
const showDialog = ref<boolean>(false); //总结编辑弹窗
const currentDate = ref(new Date()); //当前时间
const updateItem = ref<string | null>(null); //编辑待办项
const showPopup = ref<boolean>(false); //新增待办弹窗
const summary = ref<ITask>({
  message: "",
  time: new Date(),
  type: TODO_TYPE.SUMMARY,
  finish: false,
  tag: "",
  workTime: "",
});
// 提交待办表单
const taskForm = reactive<ITask>({
  message: "",
  time: new Date(),
  type: TODO_TYPE.TASK,
  tag: "",
  workTime: "",
});
// 今日待办列表
const data = reactive<{ list: ITask[] }>({
  list: [
    {
      message: "",
      finish: false,
      time: new Date(),
      type: TODO_TYPE.TASK,
      workTime: "",
    },
  ],
});

/* ================================================================================================
 * 🍊 @description: 格式化日期弹窗显示
 * 🍊 @Date: 2022-02-05 14:23:10
================================================================================================ */
const formatTimeSelect = (type: string, val: string) => {
  if (type === "month") {
    return `${val}月`;
  }
  return `${val}日`;
};

/* ================================================================================================
 * 🍊 @description: 选择日期
 * 🍊 @Date: 2022-02-05 14:21:58
================================================================================================ */
const timeSelect = async (value: Date) => {
  currentDate.value = value;
  await getData(currentDate.value);
  showTime.value = false;
};

/* ================================================================================================
 * 🍊 @description: 新增或修改待办
 * 🍊 @Date: 2022-02-05 14:22:22
================================================================================================ */
const submitTaskForm = async () => {
  taskForm.time = dayjs(currentDate.value).format("YYYY-MM-DD");
  let requestUrl = API_LIST.CREATE_TASK;
  let requestParams: ITask = taskForm;
  if (updateItem.value) {
    requestUrl = API_LIST.UPDATE_TASK;
    requestParams = {
      _id: updateItem.value,
      message: taskForm.message,
      tag: taskForm.tag,
      workTime: taskForm.workTime,
    };
  }

  const res = await request.post(requestUrl, requestParams);
  if (!res) {
    return Notify({ type: NOTIFY_TYPE.DANGER, message: "网络错误" });
  }
  showPopup.value = false;
  taskForm.message = "";
  taskForm.tag = "";
  taskForm.workTime = "";
  Notify({
    type: NOTIFY_TYPE.SUCCESS,
    message: res.message,
    duration: TIME_CONSTANTS.ONE_SECOND,
  });
  await getData();
  updateItem.value = null;
};
/* ================================================================================================
 * 🍊 @description: 删除待办
 * 🍊 @Date: 2022-02-05 14:24:01
================================================================================================ */
const deleteTask = async (task: ITask) => {
  const res = await request.post(API_LIST.DELETE_TASK, task);
  if (!res) return Notify({ type: NOTIFY_TYPE.DANGER, message: "网络错误" });
  Notify({
    type: NOTIFY_TYPE.SUCCESS,
    message: res.message,
    duration: TIME_CONSTANTS.ONE_SECOND,
  });
  await getData();
};
/* ================================================================================================
 * 🍊 @description: 更新待办完成情况
 * 🍊 @Date: 2022-02-05 14:24:13
================================================================================================ */
const finishTask = async (task: ITask) => {
  await request.post(API_LIST.FINISH_TASK, { id: task._id });
  await getData();
};

/* ================================================================================================
 * 🍊 @description: 新增或修改每日总结
 * 🍊 @Date: 2022-02-05 14:30:02
================================================================================================ */
const uploadSummary = async () => {
  summary.value.time = dayjs(currentDate.value).format("YYYY-MM-DD");
  const res = await request.post(API_LIST.CREATE_TASK, {
    message: summary.value.message,
    time: dayjs(summary.value.time).format("YYYY-MM-DD"),
    tag: TAG_TYPE.SUMMARY,
    workTime: 0,
    type: TODO_TYPE.SUMMARY,
  });
  if (!res) {
    return Notify({
      type: NOTIFY_TYPE.DANGER,
      message: "新增或修改每日总结失败",
    });
  }
  showPopup.value = false;
  taskForm.message = "";
  Notify({
    type: NOTIFY_TYPE.SUCCESS,
    message: res.message,
    duration: TIME_CONSTANTS.ONE_SECOND,
  });
  await getData();
};
/* ================================================================================================
 * 🍊 @description: 获取每日任务和每日总结数据
 * 🍊 @Date: 2022-02-05 14:30:15
================================================================================================ */
const getData = async (date: Date = currentDate.value) => {
  summary.value.message = "";
  const taskRes = await request.post(API_LIST.GET_TASK_DATA, {
    time: date,
    type: TODO_TYPE.TASK,
  });
  if (!taskRes || !taskRes?.data) {
    return Notify({
      type: NOTIFY_TYPE.DANGER,
      message: "获取每日任务数据失败",
    });
  }
  data.list = taskRes.data;
  const summaryRes = await request.post(API_LIST.GET_TASK_DATA, {
    time: date,
    type: TODO_TYPE.SUMMARY,
  });
  if (!summaryRes || !summaryRes?.data) {
    return Notify({
      type: NOTIFY_TYPE.DANGER,
      message: "获取每日总结数据失败",
    });
  }
  if (!summaryRes.data?.length) return;

  summary.value = summaryRes.data[0];
};
onMounted(async () => {
  await getData();
});
</script>
<style>
.box1 .van-cell__title {
  flex: 3 !important;
}
</style>
<style lang="scss" scoped>
.line {
  text-decoration: line-through;
  color: #aaa;
}
.main {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(@/assets/img/background.jpg);
  background-size: 100% 100%;
  color: #000;
}
.box1 {
  position: relative;
  margin: 0.62rem auto;
  height: 54%;
  width: 90%;
}
.box2 {
  position: relative;
  width: 90%;
  height: 30%;
  margin: 1rem auto;
}
</style>
