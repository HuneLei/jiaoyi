const Layout = r => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const DeliveryGrade = r => require.ensure([], () => r(require('@/views/Customer/DeliveryGrade')), 'Customer');
const HolidaySets = r => require.ensure([], () => r(require('@/views/Customer/HolidaySets')), 'Customer');

export default {
  path: '/Customer',
  component: Layout,
  icon: 'fa fa-database',
  name: '客服中心',
  children: [
    {
      path: 'DeliveryGrade',
      component: DeliveryGrade,
      name: '配送企业评分详情',
      meta: ['客服中心', 'DeliveryGrade'],
    },
    {
      path: 'HolidaySets',
      component: HolidaySets,
      name: '假期设置',
      meta: ['客服中心', 'HolidaySets'],
    },
  ]
};
