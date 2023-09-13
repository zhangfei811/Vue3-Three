import { createRouter, createWebHashHistory } from "vue-router";
// import HomeView from "../views/HomeView.vue";
let LayOut = () => import("../views/LayOut.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: LayOut,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
