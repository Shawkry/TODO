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
          text-shadow: #000 1px 0 0, #000 0 1px 0;
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
                updateItem = item._id;
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
          updateItem = false;
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
        :formatter="formatter"
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
        :columns="tagList"
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
import dayjs from "dayjs";
import request from "@/common/request";
import { Notify } from "vant";
const showTagPicker = ref<boolean>(false); //显示待办类型选择弹窗
const tagList = ["学习", "工作", "备忘", "娱乐", "运动"]; //待办类型list
const showTime = ref<boolean>(false); //显示时间选转弹窗
const showDialog = ref<boolean>(false); //总结编辑弹窗
const currentDate = ref(new Date()); //当前时间
const updateItem = ref<boolean | string>(false); //编辑待办项
const showPopup = ref<boolean>(false); //新增待办弹窗
//每日总结
const summary = ref<any>({
  message: "",
  time: new Date(),
  type: 2,
  finish: false,
  tag: "",
  workTime: "",
});
// 提交待办表单
const taskForm = reactive<any>({
  message: "",
  time: new Date(),
  type: 1,
  tag: "",
  workTime: "",
});
// 今日待办列表
const data = reactive<any>({
  list: [
    {
      message: "",
      finish: false,
      time: new Date(),
      type: 1,
      workTime: "",
    },
  ],
});

/* ================================================================================================
 * 🍊 @description: 格式化日期弹窗显示
 * 🍊 @Date: 2022-02-05 14:23:10
================================================================================================ */
const formatter = (type: any, val: any) => {
  if (type === "month") {
    return `${val}月`;
  } else if (type === "day") {
    return `${val}日`;
  }
  return val;
};

/* ================================================================================================
 * 🍊 @description: 选择日期
 * 🍊 @Date: 2022-02-05 14:21:58
================================================================================================ */
const timeSelect = (value: Date) => {
  currentDate.value = value;
  getData(currentDate.value);
  showTime.value = false;
};

/* ================================================================================================
 * 🍊 @description: 新增或修改待办
 * 🍊 @Date: 2022-02-05 14:22:22
================================================================================================ */
const submitTaskForm = async () => {
  taskForm.time = dayjs(currentDate.value).format("YYYY-MM-DD");
  if (updateItem.value !== false) {
    request
      .post("upDateTask", {
        taskId: updateItem.value,
        message: taskForm.message,
        tag: taskForm.tag,
        workTime: taskForm.workTime,
      })
      .then((res: any) => {
        showPopup.value = false;
        taskForm.message = "";
        taskForm.tag = "";
        taskForm.workTime = "";
        Notify({ type: res.type, message: res.message, duration: 1000 });
        getData();
      });
  } else {
    request.post("createTask", taskForm).then((res: any) => {
      showPopup.value = false;
      taskForm.message = "";
      taskForm.tag = "";
      taskForm.workTime = "";
      Notify({ type: res.type, message: res.message, duration: 1000 });
      getData();
    });
  }
  updateItem.value = false;
};
/* ================================================================================================
 * 🍊 @description: 删除待办
 * 🍊 @Date: 2022-02-05 14:24:01
================================================================================================ */
const deleteTask = (task: object) => {
  request.post("deleteTask", task).then((res: any) => {
    Notify({ type: res.type, message: res.message, duration: 1000 });
    getData();
  });
};
/* ================================================================================================
 * 🍊 @description: 更新待办完成情况
 * 🍊 @Date: 2022-02-05 14:24:13
================================================================================================ */
const finishTask = (item: any) => {
  request.post("finishTask", { id: item._id }).then((res) => {
    getData();
  });
};

/* ================================================================================================
 * 🍊 @description: 新增或修改每日总结
 * 🍊 @Date: 2022-02-05 14:30:02
================================================================================================ */
const uploadSummary = () => {
  summary.value.time = dayjs(currentDate.value).format("YYYY-MM-DD");
  request
    .post("createTask", {
      message: summary.value.message,
      time: dayjs(summary.value.time).format("YYYY-MM-DD"),
      tag: "总结",
      workTime: 0,
      type: 2,
    })
    .then((res: any) => {
      showPopup.value = false;
      taskForm.message = "";
      Notify({ type: res.type, message: res.message, duration: 1000 });
      getData();
    });
};
/* ================================================================================================
 * 🍊 @description: 拉取数据
 * 🍊 @Date: 2022-02-05 14:30:15
================================================================================================ */
const getData = (date: Date = currentDate.value) => {
  summary.value.message = "";
  request.post("getData", { time: date, mode: "1" }).then((res: any) => {
    data.list = res;
  });
  request.post("getData", { time: date, mode: "2" }).then((res: any) => {
    if (res.length !== 0) {
      summary.value = res[0];
    }
  });
};
onMounted(() => {
  getData();
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
  //   background-color: #879cb7 !important;
  background-image: url(@/assets/img/background.jpg);
  //   background-image: linear-gradient(
  //     to bottom,
  //     #729ecd,
  //     #89add4,
  //     #9fbbda,
  //     #b6cae0,
  //     #ccd9e7
  //   );
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
