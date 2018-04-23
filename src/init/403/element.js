import Vue from 'vue';

import { Button, Row, Col, Loading } from 'element-ui';

Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
