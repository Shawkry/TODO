/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-02 17:25:16
 * ⭐ @LastEditTime: 2022-04-10 16:12:50
 * ⭐ @Description: 请填写简介
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "font-awesome/css/font-awesome.min.css";
import "@/assets/scss/index.scss";
import "animate.css/animate.min.css";
import { VueClipboard } from "@soerenmartius/vue3-clipboard";
import "@/assets/font/font.css";
import {
  Button,
  Tabbar,
  TabbarItem,
  NavBar,
  Icon,
  SwipeCell,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Popup,
  Form,
  Field,
  DatetimePicker,
  Progress,
  Picker,
  Swipe,
  SwipeItem,
  Rate,
  Circle,
  Dialog,
} from "vant";
import {
  ElButton,
  ElButtonGroup,
  ElSelect,
  ElOption,
  ElAvatar,
  ElProgress,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from "element-plus";
import "element-plus/dist/index.css";
const components = [
  Button,
  Tabbar,
  TabbarItem,
  NavBar,
  Icon,
  SwipeCell,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Popup,
  Form,
  Field,
  DatetimePicker,
  Progress,
  Picker,
  Swipe,
  SwipeItem,
  Rate,
  Circle,
  Dialog,

  ElButton,
  ElButtonGroup,
  ElSelect,
  ElOption,
  ElAvatar,
  ElProgress,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
];

router.beforeEach((to, from, next) => {
  if (localStorage.getItem("user_token") !== null) {
    next();
  } else {
    if (to.path === "/login") {
      next();
    } else {
      next({ path: "/login" });
    }
  }
});

const app = createApp(App);
components.forEach((components) => {
  app.use(components);
});

app.use(VueClipboard);
app.use(store).use(router).mount("#app");
