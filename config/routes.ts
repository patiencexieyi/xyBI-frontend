export default [
  {
    path: "/user",
    layout: false,
    routes: [
      {
        name: "登录",
        path: "/user/login",
        component: "./user/login",
      },
      {
        name: "注册",
        path: "/user/register",
        component: "./user/register",
      },
    ],
  },
  { path: "/", redirect: "/add_chart" },
  {
    path: "/add_chart",
    name: "智能分析(同步)",
    icon: "barChart",
    component: "./addChart",
  },
  {
    path: "/add_chart_async",
    name: "智能分析(异步)",
    icon: "barChart",
    component: "./addChartAsync",
  },
  {
    path: "/my_chart",
    name: "我的图表",
    icon: "pieChart",
    component: "./myChart",
  },
    {
    path: "/predict",
    name: "智能预测",
    icon: "thunderbolt",
    component: "./predict",
  },
  {
    path: "/admin",
    name: "管理页",
    icon: "crown",
    access: "canAdmin",
    routes: [
      { path: "/admin", redirect: "/admin/sub-page" },
      { path: "/admin/sub-page", name: "二级管理页", component: "./Admin" },
    ],
  },
  { path: "/", redirect: "/welcome" },
  { path: "*", layout: false, component: "./404" },
];
