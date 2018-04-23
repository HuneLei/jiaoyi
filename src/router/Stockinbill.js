const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');
const Home = (r) => require.ensure([], () => r(require('@/views')), 'init');

const StockinBillList = (r) =>
  require.ensure([], () => r(require('@/views/Stockinbill/StockinBillList')), 'Stockinbill');
const StockinBillEdit = (r) =>
  require.ensure([], () => r(require('@/views/Stockinbill/StockinBillList/Edit')), 'Stockinbill');

const StockinBillItem = (r) =>
  require.ensure([], () => r(require('@/views/Stockinbill/StockinBillItem')), 'Stockinbill');

export default {
  path: '/Stockinbill',
  component: Layout,
  icon: 'fa fa-database',
  name: '入库单管理',
  children: [
    {
      path: 'StockinBillList',
      component: Home,
      meta: {
        functionName: '入库单管理#入库单列表',
      },
      children: [
        {
          path: '/',
          component: StockinBillList,
          name: '入库单列表',
          meta: {
            functionName: '入库单管理#入库单列表',
          },
        },
        {
          path: 'Edit',
          component: StockinBillEdit,
          name: '入库单详情',
          meta: {
            functionName: '入库单管理#入库单列表',
          },
        },
      ],
    },
    {
      path: 'StockinBillItem',
      component: StockinBillItem,
      name: '入库单明细',
      meta: {
        functionName: '入库单管理#入库单明细',
      },
    },
  ],
};
