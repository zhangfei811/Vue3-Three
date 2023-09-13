import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import MyGlobalCom from "@/components/index.js";
createApp(App).use(store).use(router).use(Antd).use(MyGlobalCom).mount("#app");
