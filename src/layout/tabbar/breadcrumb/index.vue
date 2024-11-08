<template>
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="layoutSetting.fold ? 'Expand' : 'Fold'" />
  </el-icon>
  <!-- 面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
      <el-icon style="vertical-align: top">
        <component v-if="item.meta && item.meta.icon" :is="item.meta.icon" />
      </el-icon>
      <span style="margin: 0 5px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
export default {
  name: 'Breadcrumb',
};
</script>
<script setup lang="ts">
import useLayoutSetting from '@/store/modules/setting';
const layoutSetting = useLayoutSetting();
const changeIcon = () => {
  layoutSetting.fold = !layoutSetting.fold;
};
</script>

<style scoped></style>
