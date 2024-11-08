<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script lang="ts">
export default {
  name: 'Main',
};
</script>
<script setup lang="ts">
import useLayoutSetting from '@/store/modules/setting';
import { watch, ref, nextTick } from 'vue';
const layoutSetting = useLayoutSetting();
const flag = ref(true);
watch(
  () => layoutSetting.refresh,
  () => {
    flag.value = false;
    nextTick(() => {
      flag.value = true;
    });
  },
);
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  /* transform: scale(0); */
}
.fade-enter-active {
  transition: all 1s;
}
.fade-enter-to {
  opacity: 1;
  /* transform: scale(1); */
}
</style>
