import { defineStore } from 'pinia';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cloneDeep } from 'lodash';
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user/index';
import type { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type';
import type { UserState } from './types/type';
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token';
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes';
import router from '@/router';

const useUserStore = defineStore('User', {
  state: (): UserState => ({
    token: GET_TOKEN(),
    menuRoutes: [],
    username: '',
    avatar: '',
    // 按钮权限
    buttons: [],
  }),
  actions: {
    async userLogin(data: loginFormData) {
      const result: loginResponseData = await reqLogin(data);
      if (result.code === 200) {
        this.token = result.data as string;
        SET_TOKEN(result.data as string);
        return Promise.resolve();
      } else {
        return Promise.reject(new Error(result.data));
      }
    },
    // 获取用户信息
    async userInfo() {
      const result: userInfoResponseData = await reqUserInfo();
      if (result.code === 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        this.buttons = result.data.buttons;
        const userAsyncRoute = this.filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes);
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute];
        [...userAsyncRoute, ...anyRoute].forEach((route: any) => {
          console.log('route', route);
          router.addRoute(route);
        });
        return Promise.resolve();
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    // 退出登录
    async userLogout() {
      // 通知服务器退出登录
      const result: any = await reqLogout();
      if (result.code === 200) {
        this.token = '';
        this.username = '';
        this.avatar = '';
        REMOVE_TOKEN();
        return Promise.resolve();
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    // 过滤路由
    filterAsyncRoute(asyncRoute: any, routes: any) {
      return asyncRoute.filter((item: any) => {
        if (routes.includes(item.name)) {
          if (item.children && item.children.length > 0) {
            item.children = this.filterAsyncRoute(item.children, routes);
          }
          return true;
        }
      });
    },
  },
  getters: {},
});

export default useUserStore;
