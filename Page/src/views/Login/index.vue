<!-- 
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-08 13:39:53
 * ⭐ @LastEditTime: 2022-04-27 14:37:30
 * ⭐ @Description: 登录注册页
 -->
<template>
  <div class="login">
    <div class="form-structure">
      <div class="register">
        <h2 class="form-title" id="register" ref="registerRef">
          <span>或</span>登陆
        </h2>
        <div class="form-holder">
          <input
            v-model="user.userName"
            type="email"
            class="input"
            placeholder="账号"
          />
          <input
            v-model="user.password"
            type="password"
            class="input"
            placeholder="密码"
          />
        </div>
        <div class="textBox">
          <span class="text" @click="findPWDShow = true">找回密码</span>
        </div>
        <button class="submit-btn" @click="login()">登录</button>
      </div>
      <div class="login slide-up">
        <div class="center">
          <h2 class="form-title" id="login" ref="loginRef">
            <span>或</span>注册
          </h2>
          <div class="form-holder slide-up">
            <input
              v-model="newUser.userName"
              type="text"
              class="input registerInput"
              placeholder="请输入账号，长度3~8个字符"
              pattern="^[a-zA-Z0-9]{3,10}$"
              required
            />
            <input
              v-model="newUser.password"
              type="password"
              class="input registerInput"
              placeholder="6～18位密码，必须包含英文和数字"
              pattern="^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{6,18}$"
              required
            />
            <input
              v-model="newUser.eMail"
              type="email"
              class="input registerInput"
              placeholder="请输入邮箱"
              pattern="^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$"
              required
            />
          </div>
          <button class="submit-btn" @click="register()">注册</button>
        </div>
      </div>
    </div>
    <van-dialog
      v-model:show="findPWDShow"
      title="找回密码"
      @confirm="findPassword()"
      :beforeClose="beforeClose"
      show-cancel-button
      confirmButtonColor="#91b185"
      cancelButtonColor="#aaa"
    >
      <div class="ceilBox">
        <van-form @submit="findPassword">
          <van-cell-group inset>
            <van-field
              v-model="findPasswordData.userName"
              label="用户账号"
              placeholder="请输入用户账号"
              :rules="[
                { required: true, message: '请填写用户账号' },
                {
                  pattern: USER_NAME_REGEXP,
                  message: '账号格式错误',
                },
              ]"
            />
          </van-cell-group>
          <van-cell-group inset>
            <van-field
              v-model="findPasswordData.eMail"
              label="用户邮箱"
              placeholder="请输入用户邮箱"
              :rules="[
                { required: true, message: '请填写用户邮箱' },
                {
                  pattern: EMAIL_REGEXP,
                  message: '不是正确的邮箱格式',
                },
              ]"
            />
          </van-cell-group>
          <van-cell-group inset>
            <van-field
              v-model="findPasswordData.password"
              label="新密码"
              placeholder="请输入修改密码"
              :rules="[
                { required: true, message: '请填写新的密码' },
                {
                  pattern: PASSWORD_REGEXP,
                  message: '新密码必须为6～18字符，包含英文和数字',
                },
              ]"
            />
          </van-cell-group>
        </van-form>
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { Notify } from "vant";
import request from "@/utils/request";
import { useStore } from "vuex";
import {
  EMAIL_REGEXP,
  PASSWORD_REGEXP,
  USER_NAME_REGEXP,
} from "@/constants/userRegExp";
import type { IUser } from "@/types";
import { API_LIST } from "@/constants/api";
import { CODE, NOTIFY_TYPE } from "@/constants/code";
import { newTip } from "@/constants/newTip";
const router = useRouter();
const store = useStore();
const loginRef = ref<any>();
const registerRef = ref<any>();
const user = ref({
  userName: "",
  password: "",
});
const newUser = ref<IUser>({
  userName: "",
  password: "",
  eMail: "",
});
const findPasswordData = ref<IUser>({
  userName: "",
  password: "",
  eMail: "",
});
const findPWDShow = ref<boolean>(false);
/* ================================================================================================
 * 🍊 @description: 禁止弹窗点击确认后自动关闭
 * 🍊 @Date: 2022-04-26 15:08:02
================================================================================================ */
const beforeClose = (action: string) => {
  if (action !== "confirm") {
    findPWDShow.value = false;
  }
  return;
};
/* ================================================================================================
 * 🍊 @description: 校验是否是符合规范的用户输入
 * 🍊 @Date: 2022-04-26 14:08:02
================================================================================================ */
const isLegitimateUser = (user: IUser) => {
  if (!user) return false;
  const isLegitimateUserName = USER_NAME_REGEXP.test(user.userName);
  const isLegitimatePassword = PASSWORD_REGEXP.test(user.password);
  const isLegitimateEMail = EMAIL_REGEXP.test(user?.eMail ?? "");
  return isLegitimateUserName && isLegitimatePassword && isLegitimateEMail;
};
/* ================================================================================================
 * 🍊 @description: 找回密码
 * 🍊 @Date: 2022-04-26 11:36:16
================================================================================================ */
const findPassword = async () => {
  if (!isLegitimateUser(findPasswordData.value)) {
    return Notify({
      type: NOTIFY_TYPE.DANGER,
      message: "请检查输入内容是否正确",
    });
  }
  const respond = await request.post(
    API_LIST.UPDATE_PASSWORD,
    findPasswordData.value,
  );
  if (!respond || respond?.code !== CODE.SUCCESS) {
    return Notify({
      type: NOTIFY_TYPE.DANGER,
      message: respond?.message ?? "网络错误",
    });
  }
  findPasswordData.value = {
    userName: "",
    password: "",
    eMail: "",
  };
  findPWDShow.value = false;
  Notify({
    type: NOTIFY_TYPE.SUCCESS,
    message: respond.message,
  });
};
/* ================================================================================================
 * 🍊 @description: 注册事件
 * 🍊 @Date: 2022-02-08 14:51:17
================================================================================================ */
const register = async () => {
  if (!isLegitimateUser(newUser.value)) {
    return Notify({
      type: NOTIFY_TYPE.WARNING,
      message: "格式不正确，请检查输入再提交！",
    });
  }
  const respond = await request.post(API_LIST.REGISTER, newUser.value);
  if (respond?.code === CODE.SUCCESS) {
    user.value = newUser.value;
    await login();
  }
  Notify({
    type:
      respond?.code === CODE.SUCCESS ? NOTIFY_TYPE.SUCCESS : NOTIFY_TYPE.DANGER,
    message: respond?.message ?? "网络错误",
  });
};
/* ================================================================================================
 * 🍊 @description: 登录事件
 * 🍊 @Date: 2022-02-08 14:50:52
================================================================================================ */
const login = async () => {
  const respond = await request.post(API_LIST.LOGIN, user.value);
  if (!respond || respond?.code !== CODE.SUCCESS) {
    return Notify({
      type: NOTIFY_TYPE.DANGER,
      message: respond?.message ?? "账号或密码不正确！",
    });
  }
  store.commit("setUser", respond.data);
  await request.post(API_LIST.NEW_TIP, newTip);
  await router.push({ path: "/home/dailyPlan" });
};
/* ================================================================================================
 * 🍊 @description: 登录注册跳转监听
 * 🍊 @Date: 2022-02-08 14:09:23
================================================================================================ */
const init = () => {
  console.clear();
  const loginBtn = loginRef.value;
  const registerBtn = registerRef.value;
  loginBtn.addEventListener("click", (e: any) => {
    const parent = e.target.parentNode.parentNode;
    Array.from(e.target.parentNode.parentNode.classList).find((element) => {
      if (element !== "slide-up") {
        parent.classList.add("slide-up");
      } else {
        registerBtn.parentNode.classList.add("slide-up");
        parent.classList.remove("slide-up");
      }
    });
  });
  registerBtn.addEventListener("click", (e: any) => {
    const parent = e.target.parentNode;
    Array.from(e.target.parentNode.classList).find((element) => {
      if (element !== "slide-up") {
        parent.classList.add("slide-up");
      } else {
        loginBtn.parentNode.parentNode.classList.add("slide-up");
        parent.classList.remove("slide-up");
      }
    });
  });
};
onMounted(() => {
  init();
});
onBeforeRouteLeave((_to, _form, next) => {
  if (store.getters.getUser !== "") {
    next();
  } else {
    Notify({ message: "请先登录", type: NOTIFY_TYPE.DANGER });
  }
});
</script>

<style lang="scss" scoped>
.textBox {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 10px;
  margin-right: 15px;
  .text {
    color: #eee;
    font-size: 12px;
    border-bottom: 1px solid #ddd;
  }
}
.registerInput:focus:invalid {
  background: #fff url(@/assets/img/error.png) no-repeat right 50px center;
  background-size: 20px;
}
.registerInput:focus:valid {
  background: #fff url(@/assets/img/success.png) no-repeat right 50px center;
  background-size: 20px;
}
.form-structure {
  background-color: #222;
  height: 550px;
  width: 100%;
  position: relative;
  overflow: hidden;
  &::after {
    content: "";
    opacity: 0.8;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-repeat: no-repeat;
    // background-position: left bottom;
    background-size: 100% 100%;
    // background-image: url("https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=bf884ad570b50659c5fa2dc2cfb20ecf&auto=format&fit=crop&w=1000&q=100");
    background-image: url("@/assets/img/background.jpg");
  }
  .register {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    width: 65%;
    z-index: 5;
    -webkit-transition: all 0.3s ease;

    &.slide-up {
      top: 5%;
      -webkit-transform: translate(-50%, 0%);
      -webkit-transition: all 0.3s ease;
    }

    &.slide-up .form-holder,
    &.slide-up .submit-btn {
      opacity: 0;
      visibility: hidden;
    }

    &.slide-up .form-title {
      font-size: 1em;
      cursor: pointer;
    }

    &.slide-up .form-title span {
      margin-right: 5px;
      opacity: 1;
      visibility: visible;
      display: inline;
      -webkit-transition: all 0.3s ease;
    }

    .form-title {
      color: #fff;
      font-size: 1.7em;
      text-align: center;

      span {
        color: rgba(0, 0, 0, 0.4);
        opacity: 0;
        visibility: hidden;
        display: none;
        -webkit-transition: all 0.3s ease;
      }
    }

    .form-holder {
      border-radius: 15px;
      background-color: #fff;
      overflow: hidden;
      margin-top: 50px;
      opacity: 1;
      visibility: visible;
      -webkit-transition: all 0.3s ease;
      .input {
        border: 0;
        outline: none;
        box-shadow: none;
        display: block;
        height: 30px;
        line-height: 30px;
        padding: 8px 15px;
        border-bottom: 1px solid #eee;
        width: 100%;
        font-size: 12px;

        &:last-child {
          border-bottom: 0;
        }
        &::-webkit-input-placeholder {
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }

    .submit-btn {
      background-color: rgba(0, 0, 0, 0.4);
      color: rgba(256, 256, 256, 0.7);
      border: 0;
      border-radius: 15px;
      display: block;
      margin: 15px auto;
      padding: 15px 45px;
      width: 100%;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
      opacity: 1;
      visibility: visible;
      -webkit-transition: all 0.3s ease;

      &:hover {
        transition: all 0.3s ease;
        background-color: rgba(0, 0, 0, 0.8);
      }
    }
  }

  .login {
    position: absolute;
    top: 20%;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 5;
    -webkit-transition: all 0.3s ease;

    &::before {
      content: "";
      position: absolute;
      left: 50%;
      top: -20px;
      -webkit-transform: translate(-50%, 0);
      background-color: #fff;
      width: 200%;
      height: 250px;
      border-radius: 50%;
      z-index: 4;
      -webkit-transition: all 0.3s ease;
    }

    .center {
      position: absolute;
      top: calc(50% - 10%);
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      width: 65%;
      z-index: 5;
      -webkit-transition: all 0.3s ease;

      .form-title {
        color: #000;
        font-size: 1.7em;
        text-align: center;

        span {
          color: rgba(0, 0, 0, 0.4);
          opacity: 0;
          visibility: hidden;
          display: none;
          -webkit-transition: all 0.3s ease;
        }
      }

      .form-holder {
        border-radius: 15px;
        background-color: #fff;
        border: 1px solid #eee;
        overflow: hidden;
        margin-top: 50px;
        opacity: 1;
        visibility: visible;
        -webkit-transition: all 0.3s ease;

        .input {
          border: 0;
          outline: none;
          box-shadow: none;
          display: block;
          height: 30px;
          line-height: 30px;
          padding: 8px 15px;
          border-bottom: 1px solid #eee;
          width: 100%;
          font-size: 12px;

          &:last-child {
            border-bottom: 0;
          }
          &::-webkit-input-placeholder {
            color: rgba(0, 0, 0, 0.4);
          }
        }
      }

      .submit-btn {
        background-color: #6b92a4;
        color: rgba(256, 256, 256, 0.7);
        border: 0;
        border-radius: 15px;
        display: block;
        margin: 15px auto;
        padding: 15px 45px;
        width: 100%;
        font-size: 13px;
        font-weight: bold;
        cursor: pointer;
        opacity: 1;
        visibility: visible;
        -webkit-transition: all 0.3s ease;

        &:hover {
          transition: all 0.3s ease;
          background-color: rgba(0, 0, 0, 0.8);
        }
      }
    }

    &.slide-up {
      top: 90%;
      -webkit-transition: all 0.3s ease;
    }

    &.slide-up .center {
      top: 10%;
      -webkit-transform: translate(-50%, 0%);
      -webkit-transition: all 0.3s ease;
    }

    &.slide-up .form-holder,
    &.slide-up .submit-btn {
      opacity: 0;
      visibility: hidden;
      -webkit-transition: all 0.3s ease;
    }

    &.slide-up .form-title {
      font-size: 1em;
      margin: 0;
      padding: 0;
      cursor: pointer;
      -webkit-transition: all 0.3s ease;
    }

    &.slide-up .form-title span {
      margin-right: 5px;
      opacity: 1;
      visibility: visible;
      display: inline;
      -webkit-transition: all 0.3s ease;
    }
  }
}
</style>
