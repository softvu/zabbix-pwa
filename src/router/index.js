import Vue from 'vue';
import Router from 'vue-router';
import Alerts from '@/components/Alerts';
import Login from '@/components/Login';
import auth from '@/auth';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Alerts',
      component: Alerts,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next(); // make sure to always call next()!
  }
});

export default router;
