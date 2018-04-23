import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const NotAuth = (r) => require.ensure([], () => r(require('@/views/Basic/NotAuth')), 'init');

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '*',
      name: 'NotAuth',
      component: NotAuth,
    },
  ],
});
