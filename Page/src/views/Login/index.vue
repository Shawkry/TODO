<!-- 
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-08 13:39:53
 * ⭐ @LastEditTime: 2022-04-27 14:37:30
 * ⭐ @Description: 登录注册页
 -->
<template>
  <div class="login">
    <div class="form-structor">
      <div class="signup">
        <h2 class="form-title" id="signup" ref="signup"><span>或</span>登陆</h2>

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
        <button class="submit-btn" @click="loginFunc()">登录</button>
      </div>
      <div class="login slide-up">
        <div class="center">
          <h2 class="form-title" id="login" ref="login"><span>或</span>注册</h2>
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
          <button class="submit-btn" @click="signupFunc()">注册</button>
        </div>
      </div>
    </div>
    <van-dialog
      v-model:show="findPWDShow"
      title="找回密码"
      @confirm="findPassword()"
      @cancel="
        () => {
          findPasswordData.userName = '';
          findPasswordData.eMail = '';
          findPasswordData.password = '';
        }
      "
      :beforeClose="beforeCloseFunc"
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
                  pattern: /^[a-zA-Z0-9]{3,10}$/,
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
                  pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
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
                  pattern: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{6,18}$/,
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
import { ref, reactive, onMounted, nextTick } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { Notify } from "vant";
import request from "@/common/request";
import { useStore } from "vuex";
import dayjs from "dayjs";
const router = useRouter();
const store = useStore();
const login = ref<any>();
const signup = ref<any>();
const user = reactive({
  userName: "",
  password: "",
});
const newUser = reactive({
  userName: "",
  password: "",
  eMail: "",
});
const findPasswordData = reactive({
  userName: "",
  password: "",
  eMail: "",
});
const findPWDShow = ref<boolean>(false);
/* ================================================================================================
 * 🍊 @description: 禁止弹窗点击确认后自动关闭
 * 🍊 @Date: 2022-04-26 15:08:02
================================================================================================ */
const beforeCloseFunc = (action: string) => {
  if (action === "confirm") {
  } else {
    findPWDShow.value = false;
  }
  return undefined;
};
/* ================================================================================================
 * 🍊 @description: 找回密码
 * 🍊 @Date: 2022-04-26 11:36:16
================================================================================================ */
const findPassword = () => {
  const isLegitimateUserName = /^[a-zA-Z0-9]{3,10}$/.test(
    findPasswordData.userName
  );
  const isLegitimatePassword =
    /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{6,18}$/.test(
      findPasswordData.password
    );
  const isLegitimateEMail =
    /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
      findPasswordData.eMail
    );
  if (!isLegitimateUserName || !isLegitimatePassword || !isLegitimateEMail) {
    return Notify({
      message: "请检查输入内容是否正确",
      type: "danger",
    });
  }
  request.post("/updatePassword", findPasswordData).then((res: any) => {
    if (res.code === 1) {
      findPasswordData.userName = "";
      findPasswordData.eMail = "";
      findPasswordData.password = "";
      findPWDShow.value = false;
      Notify({
        message: res.message,
        type: "success",
      });
    } else {
      Notify({
        message: res.message,
        type: "danger",
      });
    }
  });
};
/* ================================================================================================
 * 🍊 @description: 注册事件
 * 🍊 @Date: 2022-02-08 14:51:17
================================================================================================ */
const signupFunc = () => {
  let bool = true;
  const messageFunc = (type: any, message: string) => {
    Notify({
      message: message,
      type: type,
    });
  };
  const isLegitimateUserName = /^[a-zA-Z0-9]{3,10}$/.test(newUser.userName);
  const isLegitimatePassword =
    /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{6,18}$/.test(newUser.password);
  const isLegitimateEMail =
    /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(newUser.eMail);
  console.log(isLegitimateUserName, isLegitimatePassword, isLegitimateEMail);
  if (!isLegitimateUserName || !isLegitimatePassword || !isLegitimateEMail) {
    return messageFunc("warning", "格式不正确，请检查输入再提交！");
  }
  request.post("register", newUser).then((res: any) => {
    const type = res.code === 0 ? "danger" : "success";
    if (res.code === 1) {
      user.userName = newUser.userName;
      user.password = newUser.password;
      loginFunc();
    }
    messageFunc(type, res.message);
  });

  // messageShow.value = true;
};
/* ================================================================================================
 * 🍊 @description: 登录事件
 * 🍊 @Date: 2022-02-08 14:50:52
================================================================================================ */
const loginFunc = () => {
  request.post("login", user).then((res: any) => {
    store.commit("setUser", res.token);
    if (res.code === 1) {
      request
        .post("newTip", {
          message: "👈左划可以编辑和删除哦",
          time: dayjs(new Date()).format("YYYY-MM-DD"),
          type: 1,
          tag: "学习",
          workTime: "0",
        })
        .then((res) => {
          router.push({ path: "/home/dailyPlan" });
        });
    } else {
      Notify({
        message: "账号或密码不正确！",
        type: "danger",
      });
    }
  });
};
/* ================================================================================================
 * 🍊 @description: 登录注册跳转监听
 * 🍊 @Date: 2022-02-08 14:09:23
================================================================================================ */
const init = () => {
  console.clear();
  const loginBtn = login.value;
  const signupBtn = signup.value;
  loginBtn.addEventListener("click", (e: any) => {
    let parent = e.target.parentNode.parentNode;
    Array.from(e.target.parentNode.parentNode.classList).find((element) => {
      if (element !== "slide-up") {
        parent.classList.add("slide-up");
      } else {
        signupBtn.parentNode.classList.add("slide-up");
        parent.classList.remove("slide-up");
      }
    });
  });

  signupBtn.addEventListener("click", (e: any) => {
    let parent = e.target.parentNode;
    Array.from(e.target.parentNode.classList).find((element) => {
      if (element !== "slide-up") {
        parent.classList.add("slide-up");
      } else {
        loginBtn.parentNode.parentNode.classList.add("slide-up");
        parent.classList.remove("slide-up");
      }
    });
  });
  // messageShow.value = true;
};
onMounted(() => {
  // nextTick();
  init();
});
onBeforeRouteLeave((to: any, form: any, next: any) => {
  if (store.getters.getUser !== "") {
    next();
  } else {
    Notify({ message: "请先登录", type: "danger" });
  }
  // if(store.getters('getuser'))
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
    // text-decoration:underline;
  }
}
.registerInput:focus:invalid {
  background: #fff url(@/assets/img/error.png) no-repeat;
  background-position: right 50px center;
  background-size: 20px;
}
.registerInput:focus:valid {
  background: #fff url(@/assets/img/success.png) no-repeat;
  background-position: right 50px center;
  background-size: 20px;
}
.form-structor {
  background-color: #222;
  //   border-radius: 15px;
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

  .signup {
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
