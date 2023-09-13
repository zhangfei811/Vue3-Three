<template>
  <div class="main">
    <component :is="checkCurrentCom.name"></component>
  </div>
</template>
<script setup>
import { defineProps, watch } from "vue";
const props = defineProps({
  checkCurrentCom: {
    type: Object,
    default() {
      return { name: "ThreeVirtualHouse" };
    },
  },
});
</script>
<style lang="less" scoped>
.main {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
