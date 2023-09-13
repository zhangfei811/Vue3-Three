<template>
  <div class="container">
    <div class="container-side">
      <Aside @check-current-com="checkCurrentComFun"></Aside>
    </div>
    <div class="container-content">
      <Main :checkCurrentCom="selectComponent"></Main>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import Aside from "../components/aside/index.vue";
import Main from "@/components/main/index.vue";
// 定义接收的参数，并传递给Main组件
let selectComponent = ref({
  name: "ThreeVirtualHouse",
});
let checkCurrentComFun = (card) => {
  console.log("我是接收的card", card);
  selectComponent.value.name = card.name;
};
</script>
<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  &-side {
    width: 300px;
    background-color: gainsboro;
    display: flex;
    flex-flow: wrap;
    align-items: flex-start;
    max-height: 100vh;
    overflow-y: auto;
  }
  &-content {
    // flex: 1;
    width: calc(100vw - 300px);
    margin: 0;
    padding: 0;
  }
  //   justify-content: center;
  //   align-content: center;
}
</style>
