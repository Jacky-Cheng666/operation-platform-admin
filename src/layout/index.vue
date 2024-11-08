<template>
  <div class="layout_container">
    <div class="layout_slider" :class="{ fold: layoutSetting.fold }">
      <Logo />
      <el-scrollbar class="scrollbar">
        <el-menu
          :collapse="layoutSetting.fold"
          router
          :default-active="$route.path"
          background-color="#001529"
          text-color="#ffffff"
        >
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="layout_tabbar" :class="{ fold: layoutSetting.fold }">
      <Tabbar />
    </div>
    <div class="layout_main" :class="{ fold: layoutSetting.fold }">
      <Main />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Layout',
};
</script>
<script setup lang="ts">
import Logo from './logo/index.vue';
import Menu from './menu/index.vue';
import useUserStore from '@/store/modules/user';
import Main from './main/index.vue';
import Tabbar from './tabbar/index.vue';
import useLayoutSetting from '@/store/modules/setting';

const userStore = useUserStore();
const layoutSetting = useLayoutSetting();
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  position: relative;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
    transition: all 0.3s;
    &.fold {
      width: $base-menu-min-width;
    }
    .scrollbar {
      height: calc(100vh - $base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
  }
  .layout_tabbar {
    position: fixed;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
