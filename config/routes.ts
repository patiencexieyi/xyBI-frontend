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
  { path: "/add_chart", name: "添加图表页", icon: "smile", component: "./addChart" },
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
