<template>
  <div class="logo" v-if="setting.showLogo">
    <template v-if="!layoutSetting.fold">
      <img :src="setting.logo" alt="" />
      <p>{{ setting.title }}</p>
    </template>
    <template v-else>
      <img :src="setting.logo" alt="" />
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Logo',
};
</script>
<script setup lang="ts">
import setting from '@/setting';
import useLayoutSetting from '@/store/modules/setting';
const layoutSetting = useLayoutSetting();
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  align-items: center;
  padding: 20px;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    margin-left: 10px;
    color: #ffffff;
    font-size: $base-logo-title-fontSize;
    white-space: nowrap;
  }
}
</style>
