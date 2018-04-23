const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const GpoStockoutList = (r) =>
  require.ensure([], () => r(require('@/views/Gpostockout/GpoStockoutList')), 'Reportnum');
const Edit = (r) =>
  require.ensure([], () => r(require('@/views/Gpostockout/GpoStockoutList/Edit')), 'Reportnum');
const GpoStockoutItem = (r) =>
  require.ensure([], () => r(require('@/views/Gpostockout/GpoStockoutItem')), 'Reportnum');

export default {
  path: '/Gpostockout',
  component: Layout,
  icon: 'fa fa-database',
  name: 'GPO出库管理',
  children: [
    {
      path: 'GpoStockoutList',
      component: GpoStockoutList,
      name: '出库单列表',
      meta: {
        functionName: 'GPO出库管理#出库单列表',
      },
    },
    {
      path: 'GpoStockoutList/Edit',
      component: Edit,
      name: '出库单列表详情',
      meta: {
        functionName: 'GPO出库管理#出库单列表',
      },
    },
    {
      path: 'GpoStockoutItem',
      component: GpoStockoutItem,
      name: '出库单明细',
      meta: {
        functionName: 'GPO出库管理#出库单明细',
      },
    },
  ],
};
