import router from './router';
import nprogress from 'nprogress';
nprogress.configure({ showSpinner: false });
import 'nprogress/nprogress.css';
import pinia from './store';
import useUserStore from './store/modules/user';
import setting from './setting';
const userStore = useUserStore(pinia);

router.beforeEach(async (to: any, _from: any, next: any) => {
  nprogress.start();
  const token = userStore.token;
  const username = userStore.username;

  if (token) {
    if (to.path === '/login') {
      next('/');
    } else {
      if (!username) {
        try {
          await userStore.userInfo();
          next({ ...to, replace: true });
        } catch (error) {
          await userStore.userLogout();
          next({ path: '/login', query: { redirect: to.path } });
        }
      } else {
        next();
      }
    }
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next({ path: '/login', query: { redirect: to.path } });
    }
  }
});

router.afterEach((to: any) => {
  document.title = setting.title + '-' + to.meta.title;
  nprogress.done();
});
