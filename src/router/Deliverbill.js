const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const DeliverBillList = (r) =>
  require.ensure([], () => r(require('@/views/Deliverbill/DeliverBillList')), 'Deliverbill');
const CheckDItem = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverbill/DeliverBillList/CheckDItem')),
    'Deliverbill',
  );
const CreatDeliver = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverbill/DeliverBillList/CreatDeliver')),
    'Deliverbill',
  );
const DeliverBillItem = (r) =>
  require.ensure([], () => r(require('@/views/Deliverbill/DeliverBillItem')), 'Deliverbill');

export default {
  path: '/Deliverbill',
  component: Layout,
  icon: 'fa fa-database',
  name: '配送单管理',
  children: [
    {
      path: 'DeliverBillList',
      component: DeliverBillList,
      name: '配送单列表',
      meta: {
        functionName: '配送单管理#配送单列表',
      },
      children: [
        {
          path: 'CheckDItem',
          component: CheckDItem,
          name: '配送单列表详情',
          meta: {
            functionName: '配送单管理#配送单列表',
          },
          children: [
            {
              path: 'DelivePrint',
              redirect: '/Print',
              name: '配送单列表打印',
              meta: {
                functionName: '配送单管理#配送单列表',
              },
            },
          ],
        },
        {
          path: 'CreatDeliver',
          component: CreatDeliver,
          name: '配送单列表新增',
          meta: {
            functionName: '配送单管理#配送单列表',
          },
        },
      ],
    },
    {
      path: 'DeliverBillItem',
      component: DeliverBillItem,
      name: '配送单明细',
      meta: {
        functionName: '配送单管理#配送单明细',
      },
    },
  ],
};
