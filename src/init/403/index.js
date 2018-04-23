import Vue from 'vue';

import './element';
import App from './App';
import router from './router';
import store from '../../vuex/store';
import config from '../../config';

const spinnerHide = () => {
  const $spinner = document.getElementById('spinner');
  $spinner.style.display = 'none';
};

const goVue = () => {
  spinnerHide();

  router.beforeEach((to, from, next) => {
    next();
  });

  router.afterEach((transition) => {});

  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
};

goVue();
