/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-02 17:34:46
 * ⭐ @LastEditTime: 2022-04-21 16:42:31
 * ⭐ @Description: 路由配置文件
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home/dailyPlan",
    // redirect: "/login",
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/Home/index.vue"),
    children: [
      {
        path: "dailyPlan",
        name: "dailyPlan",
        component: () => import("../views/DailyPlan/index.vue"),
      },
      {
        path: "focus",
        name: "focus",
        component: () => import("../views/Focus/index.vue"),
      },
      {
        path: "dataStatistics",
        name: "dataStatistics",
        component: () => import("../views/DataStatistics/index.vue"),
      },
      {
        path: "user",
        name: "user",
        component: () => import("../views/User/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login/index.vue"),
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
export default router;
