<!-- 
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-08 00:09:33
 * ⭐ @LastEditTime: 2022-04-27 14:15:51
 * ⭐ @Description: 用户管理
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
              @click="updateUserBox(1)"
              is-link
            />
            <van-cell
              title="邮箱"
              :value="user.data.eMail"
              @click="updateUserBox(2)"
              is-link
            />
            <van-cell title="修改密码" @click="updateUserBox(3)" is-link />
            <van-cell
              title="分享App"
              @click="share()"
              v-clipboard="
                `TODO网页地址：https://www.shawry14.top/todo-list，
安卓下载链接: https://pan.baidu.com/s/1aon28y2X4weJ4UAEP19PMw?pwd=mc4d 提取码: mc4d `
              "
              is-link
            />
            <van-cell title="意见反馈" @click="feedBackShow = true" is-link />
            <van-cell title="作者邮箱" value="18928201209@163.com" />
          </van-cell-group>
        </div>
      </div>
      <br /><br /><br />
      <div class="Btn">
        <div style="position: relative; width: 90%; margin: 0 auto">
          <van-button
            type="danger"
            size="normal"
            style="width: 100%"
            @click="signOut()"
            >退出登录</van-button
          >
        </div>
      </div>
    </div>
    <van-dialog
      v-model:show="updateUserShow"
      :title="updateUserInput.title"
      @confirm="updateUserMessage()"
      @cancel="() => {}"
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
              v-model="updateUserInput.password"
              type="password"
              label="密码"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请填写密码' }]"
            />
          </van-cell-group>
          <van-cell-group inset>
            <van-field
              v-model="updateUserInput.value"
              :label="updateUserInput.label"
              :placeholder="updateUserInput.placeholder"
              :rules="updateUserInput.rules"
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
          feedBackMessage = '';
          rateValue = 0;
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
          v-model="feedBackMessage"
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
import request from "@/common/request";
const router = useRouter();
const store = useStore();
const feedBackShow = ref<boolean>(false);
const feedBackMessage = ref<string>("");
const rateValue = ref<number>(0);
const user = reactive<any>({
  data: {
    userName: "",
    eMail: "",
  },
});
const updateUserShow = ref<boolean>(false);
const updateUserInput = reactive<any>({
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
const signOut = () => {
  store.commit("setUser", "");
  localStorage.removeItem("user_token");
  router.push({ path: "/login" });
};
/* ================================================================================================
 * 🍊 @description: 禁止弹窗点击确认后自动关闭
 * 🍊 @Date: 2022-04-26 15:08:02
================================================================================================ */
const beforeCloseFunc = (action: string) => {
  if (action === "confirm") {
  } else {
    updateUserInput.title = "";
    updateUserInput.label = "";
    updateUserInput.placeholder = "";
    (updateUserInput.value = ""), (updateUserInput.password = "");
    updateUserInput.rules = [];
    updateUserInput.type = "";
    updateUserShow.value = false;
  }
  return undefined;
};
/* ================================================================================================
 * 🍊 @description: 意见反馈
 * 🍊 @Date: 2022-02-08 02:11:40
================================================================================================ */
const feedBack = () => {
  // rateValue.value = 0;
  // feedBackMessage.value = "";
  request
    .post("feedBack", {
      rateValue: rateValue.value,
      feedBackMessage: feedBackMessage.value,
    })
    .then((res: any) => {
      Notify({
        type: res.type,
        message: res.message,
      });
    });
};
/* ================================================================================================
 * 🍊 @description: 修改用户信息弹出框
 * 🍊 @Date: 2022-02-08 02:05:38
================================================================================================ */
const updateUserBox = (type: number) => {
  if (type === 1) {
    updateUserInput.title = "修改账号: ";
    updateUserInput.label = "新的账号名: ";
    updateUserInput.placeholder = "请输入新的账号名";
    updateUserInput.type = "userName";
    updateUserInput.rules = [
      { required: true, message: "账号名不允许为空" },
      {
        pattern: /^[a-zA-Z0-9]{3,10}$/,
        message: "账号名必须为3~8个字符",
      },
    ];
  } else if (type === 2) {
    updateUserInput.title = "修改邮箱: ";
    updateUserInput.label = "新邮箱: ";
    updateUserInput.placeholder = "请输入新的邮箱地址";
    updateUserInput.type = "eMail";
    updateUserInput.rules = [
      { required: true, message: "邮箱地址不允许为空" },
      {
        pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        message: "请正确输入邮箱地址",
      },
    ];
  } else if (type === 3) {
    updateUserInput.title = "修改密码: ";
    updateUserInput.label = "新密码: ";
    updateUserInput.placeholder = "请输入新的密码";
    updateUserInput.type = "password";
    updateUserInput.rules = [
      { required: true, message: "密码不允许为空" },
      {
        pattern: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{6,18}$/,
        message: "新密码必须为6～18字符，包含英文和数字",
      },
    ];
  }
  updateUserShow.value = true;
};
/* ================================================================================================
 * 🍊 @description: 修改用户信息
 * 🍊 @Date: 2022-02-08 02:05:38
================================================================================================ */
const updateUserMessage = () => {
  if (updateUserInput.rules[1].pattern.test(updateUserInput.value)) {
    request
      .post("updateUserMessage", {
        userName: user.data.userName,
        type: updateUserInput.type,
        value: updateUserInput.value,
        password: updateUserInput.password,
      })
      .then((res: any) => {
        if (res.code === 0) {
          Notify({
            type: "danger",
            message: res.message,
          });
        } else {
          Notify({
            type: "success",
            message: res.message,
          });
          console.log(updateUserShow);
          updateUserShow.value = false;
          updateUserInput.title = "";
          updateUserInput.label = "";
          updateUserInput.placeholder = "";
          updateUserInput.value = "";
          updateUserInput.password = "";
          updateUserInput.rules = [];
          updateUserInput.type = "";
          getData();
        }
      });
  }
};

/* ================================================================================================
 * 🍊 @description: 分享app
 * 🍊 @Date: 2022-02-08 02:05:54
================================================================================================ */
const share = () => {
  Notify({
    type: "success",
    message: "已复制分享链接，快去分享吧！",
  });
};
/* ================================================================================================
 * 🍊 @description: 获取用户信息
 * 🍊 @Date: 2022-04-25 21:55:14
================================================================================================ */
const getData = () => {
  request.post("getUserData", {}).then((res: any) => {
    if (res.code !== 0) {
      delete res.code;
      user.data = res;
    } else {
      Notify({
        type: "danger",
        message: "用户身份过期，请重新登陆",
      });
    }
  });
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
