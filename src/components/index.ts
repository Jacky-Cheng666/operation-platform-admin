// 遍历注册所有的公共组件
import SvgIcon from './SvgIcon/index.vue';
import Pagination from './Pagination/index.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import Category from './Category/index.vue';

const allComponent = { SvgIcon, Pagination, Category };
export default {
  install(app: any) {
    for (const [key, component] of Object.entries(allComponent)) {
      app.component(key, component);
    }
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
