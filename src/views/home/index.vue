<template>
  <div>
    <el-card>
      <div class="box">
        <img class="avatar" :src="userStore.avatar" alt="" />
        <div class="bottom">
          <h3 class="title">{{ getTime() }}好！{{ userStore.username }}</h3>
          <p class="subtitle">XXX运营平台</p>
        </div>
      </div>
    </el-card>
    <div class="wel">
      <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useUserStore from '@/store/modules/user';
import { getTime } from '@/utils/time';

const userStore = useUserStore();

onMounted(() => {
  console.log('onMounted-home');
});
</script>

<style scoped lang="scss">
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .bottom {
    margin-left: 20px;
    .title {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .subtitle {
      font-style: italic;
    }
  }
}
.wel {
  margin-top: 80px;
  display: flex;
  justify-content: center;
}
</style>
