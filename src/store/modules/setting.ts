import { defineStore } from 'pinia';

const useLayoutSetting = defineStore('Setting', {
  state: () => ({
    fold: false, //控制菜单折叠或收起
    refresh: false,
  }),
  actions: {},
  getters: {},
});

export default useLayoutSetting;
