<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="rules">
          <h1>hello</h1>
          <h2>欢迎来到XXX</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              show-password
              type="password"
              :prefix-icon="Lock"
              placeholder="请输入密码"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login_btn" type="primary" size="default" :loading="loading" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import useUserStore from '@/store/modules/user';
import { useRouter, useRoute } from 'vue-router';
import { ElNotification } from 'element-plus';
import { getTime } from '@/utils/time';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const loginForm = reactive({
  username: 'admin',
  password: '111111',
});
const loading = ref(false);
const loginFormRef = ref();

const login = async () => {
  await loginFormRef.value.validate();
  try {
    loading.value = true;
    await userStore.userLogin(loginForm);
    loading.value = false;
    const redirect: any = route.query.redirect;
    router.push({ path: redirect || '/' });
    ElNotification({
      title: 'Hi，' + getTime() + '好',
      type: 'success',
      message: '欢迎回来',
    });
  } catch (error) {
    loading.value = false;
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    });
  }
};

const checkUsername = (_rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback();
  } else {
    callback(new Error('账号长度至少为5位'));
  }
};

const checkPassword = (_rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback();
  } else {
    callback(new Error('账号长度至少为6位'));
  }
};

const rules = {
  username: [
    // { required: true, message: '请输入用户名', trigger: 'blur' },
    // { min: 5, max: 10, message: '账号长度5-10位', trigger: 'blur' },
    { trigger: 'blur', validator: checkUsername },
  ],
  password: [
    // { required: true, message: '请输入密码', trigger: 'blur' },
    // { min: 6, max: 15, message: '密码长度至少6位', trigger: 'blur' },
    { trigger: 'blur', validator: checkPassword },
  ],
};
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form {
    background: url('@/assets/images/login_form.png');
    background-size: cover;
    position: relative;
    width: 80%;
    top: 30vh;
    padding: 40px;
    h1 {
      color: #fff;
      font-size: 40px;
    }
    h2 {
      color: #fff;
      font-size: 20px;
      margin: 20px 0;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
