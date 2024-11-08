// 商品分类全局组件的小仓库
import { defineStore } from 'pinia';
import { reqC1, reqC2, reqC3 } from '@/api/product/attr/index';
import { ElMessage } from 'element-plus';
import type { CategoryResponseData } from '@/api/product/attr/type';
import type { CategoryState } from './types/type';

const useCategoryStore = defineStore('Category', {
  state: (): CategoryState => ({
    c1Arr: [],
    c2Arr: [],
    c3Arr: [],
    c1Id: '',
    c2Id: '',
    c3Id: '',
  }),
  actions: {
    async getC1() {
      const result: CategoryResponseData = await reqC1();
      if (result.code === 200) {
        this.c1Arr = result.data;
      } else {
        ElMessage.error('分类获取失败');
      }
    },
    async getC2() {
      const result: CategoryResponseData = await reqC2(this.c1Id);
      if (result.code === 200) {
        this.c2Arr = result.data;
      } else {
        ElMessage.error('分类获取失败');
      }
    },
    async getC3() {
      const result: CategoryResponseData = await reqC3(this.c2Id);
      if (result.code === 200) {
        this.c3Arr = result.data;
      } else {
        ElMessage.error('分类获取失败');
      }
    },
  },
  getters: {},
});

export default useCategoryStore;
