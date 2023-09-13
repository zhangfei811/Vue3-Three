<template>
  <div class="aside">
    <a-card
      hoverable
      style="width: 125px"
      v-for="(card, index) in layers"
      :key="index"
      class="aside-card"
      @click="selectCurrentCom(card)"
    >
      <template #cover>
        <img :src="card.img" width="125" height="125" />
      </template>
      <a-card-meta :title="card.disName"></a-card-meta>
    </a-card>
  </div>
</template>
<script setup>
import { defineEmits } from "vue";
import { layers } from "./config.js";
// 定义子向父级传递函数
const emit = defineEmits(["check-current-com"]);
const selectCurrentCom = (card) => {
  emit("check-current-com", card);
};
</script>
<style lang="less" scoped>
.aside {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  flex-wrap: wrap;
  &-card {
    margin: 10px;
  }
}
</style>
