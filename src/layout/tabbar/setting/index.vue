<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefresh" />
  <el-button size="small" icon="FullScreen" circle @click="fullScreen" />

  <el-popover placement="bottom" title="主题设置" :width="200" trigger="click">
    <el-form ref="form">
      <el-form-item label="主题颜色">
        <el-color-picker v-model="color" :teleported="false" show-alpha :predefine="predefineColors" @change="setColor" />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch v-model="dark" inline-prompt active-icon="MoonNight" inactive-icon="Sunny" @change="changeDark" />
      </el-form-item>
    </el-form>

    <template #reference> <el-button size="small" icon="Setting" circle /> </template>
  </el-popover>
  <img :src="userStore.avatar" alt="" style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%" />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
export default {
  name: 'Setting',
};
</script>
<script setup lang="ts">
import useLayoutSetting from '@/store/modules/setting';
import useUserStore from '@/store/modules/user';
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';

const layoutSetting = useLayoutSetting();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const color = ref('rgba(255, 69, 0, 0.68)');
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
]);
const dark = ref<boolean>(false);

const updateRefresh = () => {
  layoutSetting.refresh = !layoutSetting.refresh;
};

const fullScreen = () => {
  let full = document.fullscreenElement;
  if (!full) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

const logout = async () => {
  await userStore.userLogout();
  router.replace({ path: '/login', query: { redirect: route.path } });
};

const changeDark = () => {
  const html = document.documentElement;
  dark.value ? (html.className = 'dark') : (html.className = '');
};

const setColor = () => {
  console.log('setColor');

  const html = document.documentElement;
  html.style.setProperty('--el-color-primary', color.value);
};
</script>

<style scoped></style>
