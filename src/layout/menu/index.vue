<template>
  <template v-for="item in menuList" :key="item.path">
    <!-- 无子路由 -->
    <el-menu-item v-if="!item.meta.hidden && !item.children" :index="item.path">
      <el-icon>
        <component :is="item.meta.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
    <!-- 一个子路由 -->
    <template v-if="item.children && item.children.length === 1">
      <el-menu-item v-if="!item.children[0].meta.hidden" :index="item.children[0].path">
        <el-icon>
          <component :is="item.children[0].meta.icon" />
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 多级路由 -->
    <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.path">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children" />
    </el-sub-menu>
  </template>
</template>

<script lang="ts">
export default {
  name: 'Menu',
};
</script>
<script setup lang="ts">
defineProps({
  menuList: Array,
});
</script>

<style scoped>
p {
  color: white;
}
</style>
