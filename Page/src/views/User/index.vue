<!-- 
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-08 00:09:33
 * ⭐ @LastEditTime: 2022-04-27 14:15:51
 * ⭐ @Description: 用户信息管理
 -->
<template>
  <div class="user">
    <div class="content snowBox">
      <div class="animate__animated animate__slideInDown">
        <div class="avatar" style="display: flex; margin-top: 10%">
          <div style="flex: 1; text-align: center">
            <el-avatar
              :size="150"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            ></el-avatar>
          </div>
        </div>
        <div class="ceilBox">
          <van-cell-group>
            <van-cell
              title="账号"
              :value="user.data.userName"
              @click="updateUserForm(UPDATE_TYPE.USER_NAME)"
              is-link
            />
            <van-cell
              title="邮箱"
              :value="user.data.eMail"
              @click="updateUserForm(UPDATE_TYPE.EMAIL)"
              is-link
            />
            <van-cell
              title="修改密码"
              @click="updateUserForm(UPDATE_TYPE.PASSWORD)"
              is-link
            />
            <van-cell
              title="分享App"
              @click="share()"
              v-clipboard="
                `TODO网页地址：https://www.shawkry.top/todo，
安卓下载链接: https://www.aliyundrive.com/s/fSdY2cvB8Z7`
              "
              is-link
            />
            <van-cell title="意见反馈" @click="feedBackShow = true" is-link />
            <van-cell title="作者邮箱" value="shawkrycao@gmail.com" />
          </van-cell-group>
        </div>
      </div>
      <br /><br />
      <div class="Btn">
        <div style="position: relative; width: 90%; margin: 0 auto">
          <van-button
            type="danger"
            size="normal"
            style="width: 100%"
            @click="exit()"
            >退出登录</van-button
          >
        </div>
      </div>
    </div>
    <van-dialog
      v-model:show="updateUserShow"
      :title="updateUserInputValue.title"
      @confirm="updateUserInfo()"
      show-cancel-button
      :beforeClose="beforeCloseFunc"
      confirmButtonColor="#91b185"
      cancelButtonColor="#aaa"
    >
      <div class="ceilBox">
        <van-form>
          <van-cell-group inset>
            <van-field
              label="账号："
              :model-value="user.data.userName"
              readonly
            />
          </van-cell-group>
          <van-cell-group inset>
            <van-field
              v-model="updateUserInputValue.password"
              type="password"
              label="密码"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
          </van-cell-group>
          <van-cell-group inset>
            <van-field
              v-model="updateUserInputValue.value"
              :label="updateUserInputValue.label"
              :placeholder="updateUserInputValue.placeholder"
              :rules="updateUserInputValue.rules"
            />
          </van-cell-group>
        </van-form>
      </div>
    </van-dialog>
    <van-dialog
      v-model:show="feedBackShow"
      title="意见反馈"
      @confirm="feedBack()"
      @cancel="
        () => {
          feedBackValue = '';
          rateValue = 0;
        }
      "
      :beforeClose="
        (action: string) => {
          return !(action === 'confirm' && feedBackValue === '');
        }
      "
      show-cancel-button
      confirmButtonColor="#91b185"
      cancelButtonColor="#aaa"
    >
      <br />
      <div>
        <van-rate
          v-model="rateValue"
          allow-half
          color="#7bb1ee"
          void-icon="star"
          void-color="#eee"
          style="margin-left: 15px !important"
        />
        <van-field
          v-model="feedBackValue"
          rows="5"
          type="textarea"
          placeholder="请输入您宝贵的意见"
          show-word-limit
        />
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { Notify } from "vant";
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import request from "@/utils/request";
import { API_LIST } from "@/constants/api";
import { CODE, NOTIFY_TYPE } from "@/constants/code";
import {
  EMAIL_REGEXP,
  PASSWORD_REGEXP,
  USER_NAME_REGEXP,
} from "@/constants/userRegExp";
import type { IUpdateUserForm } from "@/types";
enum UPDATE_TYPE {
  USER_NAME = 1,
  EMAIL,
  PASSWORD,
}
const router = useRouter();
const store = useStore();
const feedBackShow = ref<boolean>(false);
const feedBackValue = ref<string>("");
const rateValue = ref<number>(0);
const user = reactive<{ data: { userName: string; eMail: string } }>({
  data: {
    userName: "",
    eMail: "",
  },
});
const updateUserShow = ref<boolean>(false);
const updateUserInputValue = ref<IUpdateUserForm>({
  title: "",
  label: "",
  placeholder: "",
  value: "",
  password: "",
  rules: [],
  type: "",
});
/* ================================================================================================
 * 🍊 @description: 退出登陆
 * 🍊 @Date: 2022-04-27 14:15:25
================================================================================================ */
const exit = () => {
  store.commit("setUser", "");
  localStorage.removeItem("user_token");
  router.push({ path: "/login" });
};
/* ================================================================================================
 * 🍊 @description: 禁止弹窗点击确认后自动关闭
 * 🍊 @Date: 2022-04-26 15:08:02
================================================================================================ */
const beforeCloseFunc = (action: string) => {
  if (action !== "confirm") {
    updateUserInputValue.value = {
      title: "",
      label: "",
      placeholder: "",
      value: "",
      password: "",
      rules: [],
      type: "",
    };
    updateUserShow.value = false;
  }
};
/* ================================================================================================
 * 🍊 @description: 意见反馈
 * 🍊 @Date: 2022-02-08 02:11:40
================================================================================================ */
const feedBack = async () => {
  if (!feedBackValue.value || feedBackValue.value === "") {
    Notify({ type: NOTIFY_TYPE.WARNING, message: "请输入反馈意见" });
    return false;
  }
  const respond = await request.post(API_LIST.FEED_BACK, {
    rateValue: rateValue.value,
    feedBackMessage: feedBackValue.value,
  });
  if (!respond) {
    return Notify({
      type: NOTIFY_TYPE.DANGER,
      message: "网络异常",
    });
  }
  Notify({
    type: NOTIFY_TYPE.SUCCESS,
    message: respond.message,
  });
};
/* ================================================================================================
 * 🍊 @description: 修改用户信息弹出框
 * 🍊 @Date: 2022-02-08 02:05:38
================================================================================================ */
const updateUserForm = (type: number) => {
  switch (type) {
    case UPDATE_TYPE.USER_NAME: {
      updateUserInputValue.value = {
        ...updateUserInputValue.value,
        title: "修改账号: ",
        label: "新的账号名: ",
        placeholder: "请输入新的账号名",
        type: "userName",
        rules: [
          { required: true, message: "账号名不允许为空" },
          {
            pattern: USER_NAME_REGEXP,
            message: "账号名必须为3~8个字符",
          },
        ],
      };
      break;
    }
    case UPDATE_TYPE.EMAIL: {
      updateUserInputValue.value = {
        ...updateUserInputValue.value,
        title: "修改邮箱: ",
        label: "新邮箱: ",
        placeholder: "请输入新的邮箱地址",
        type: "eMail",
        rules: [
          { required: true, message: "邮箱地址不允许为空" },
          {
            pattern: EMAIL_REGEXP,
            message: "请正确输入邮箱地址",
          },
        ],
      };
      break;
    }
    case UPDATE_TYPE.PASSWORD: {
      updateUserInputValue.value = {
        ...updateUserInputValue.value,
        title: "修改密码: ",
        label: "新密码: ",
        placeholder: "请输入新的密码",
        type: "password",
        rules: [
          { required: true, message: "密码不允许为空" },
          {
            pattern: PASSWORD_REGEXP,
            message: "新密码必须为6～18字符，包含英文和数字",
          },
        ],
      };
      break;
    }
  }
  updateUserShow.value = true;
};
/* ================================================================================================
 * 🍊 @description: 修改用户信息
 * 🍊 @Date: 2022-02-08 02:05:38
================================================================================================ */
const updateUserInfo = async () => {
  const regExp = updateUserInputValue.value.rules[1].pattern;
  if (!regExp.test(updateUserInputValue.value.value)) {
    return Notify({
      type: NOTIFY_TYPE.DANGER,
      message: "输入内容不符合规范",
    });
  }
  const respond = await request.post(API_LIST.UPDATE_USER_INFO, {
    userName: user.data.userName,
    type: updateUserInputValue.value.type,
    value: updateUserInputValue.value.value,
    password: updateUserInputValue.value.password,
  });
  if (!respond || respond.code === CODE.ERROR) {
    return Notify({
      type: NOTIFY_TYPE.DANGER,
      message: respond?.message ?? "网络错误",
    });
  }
  Notify({
    type: NOTIFY_TYPE.SUCCESS,
    message: respond?.message,
  });
  updateUserShow.value = false;
  updateUserInputValue.value = {
    title: "",
    label: "",
    placeholder: "",
    value: "",
    password: "",
    rules: [],
    type: "",
  };
  await getData();
};

/* ================================================================================================
 * 🍊 @description: 分享app
 * 🍊 @Date: 2022-02-08 02:05:54
================================================================================================ */
const share = () => {
  Notify({
    type: NOTIFY_TYPE.SUCCESS,
    message: "已复制分享链接，快去分享吧！",
  });
};
/* ================================================================================================
 * 🍊 @description: 获取用户信息
 * 🍊 @Date: 2022-04-25 21:55:14
================================================================================================ */
const getData = async () => {
  const respond = await request.post(API_LIST.GET_USER_INFO, {});
  if (!respond || respond.code === CODE.ERROR) {
    return Notify({
      type: NOTIFY_TYPE.DANGER,
      message: "用户身份过期，请重新登陆",
    });
  }
  user.data = respond.data;
};
onMounted(() => {
  getData();
});
</script>
<style>
.ceilBox .van-cell__value {
  flex: 3 !important;
}
</style>
<style lang="scss" scoped>
.user {
  position: relative;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url(@/assets/img/background.jpg);
  background-size: 100% 100%;
}
.content {
  position: relative;
  margin: 0 auto;
  top: 8%;
  height: 80%;
  width: 90%;
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
