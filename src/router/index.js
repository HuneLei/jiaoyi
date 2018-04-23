/**
 * Created by yaoling on 2017/7/12.
 * <p>
 * 江苏摇铃网络科技有限公司，版权所有。
 * Copyright (C) 2015-2017 All Rights Reserved.
 */
import Vue from 'vue';
import Router from 'vue-router';
import Basic from './Basic';
import BaseInfo from './BaseInfo';
import Drugs from './Drugs';
import Order from './Order';
import Return from './Return';
import Deliverbill from './Deliverbill';
import Stockinbill from './Stockinbill';
import Contract from './Contract';
import Reportnum from './Reportnum';
import Deliverrelation from './Deliverrelation';
import Deliverypurchase from './Deliverypurchase';
import Gpostockout from './Gpostockout';
import Gpopurchase from './Gpopurchase';
import Deliverystock from './Deliverystock';
import Invoice from './Invoice';
import Customer from './Customer';
import Prints from './Prints';
import General from './General';
import SurveyReport from './SurveyReport';

Vue.use(Router);

const Blank = (r) => require.ensure([], () => r(require('@/views/Basic/Blank')), 'init');
const NotAuth = (r) => require.ensure([], () => r(require('@/views/Basic/NotAuth')), 'init');
const NotFound = (r) => require.ensure([], () => r(require('@/views/Basic/NotFound')), 'init');

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'blank',
      component: Blank,
    },
    {
      path: '/403',
      name: '403',
      component: NotAuth,
    },
    {
      path: '*',
      name: '404',
      component: NotFound,
    },
    Basic,
    BaseInfo,
    Drugs,
    Order,
    Deliverbill,
    Stockinbill,
    Return,
    Contract,
    Reportnum,
    Deliverrelation,
    Deliverypurchase,
    Gpopurchase,
    Gpostockout,
    Deliverystock,
    Invoice,
    Customer,
    Prints,
    General,
    SurveyReport,
  ],
});
