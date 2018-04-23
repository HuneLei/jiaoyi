const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const ReturnBillsList = (r) =>
  require.ensure([], () => r(require('@/views/Return/ReturnBillsList')), 'Return');
const CheckItem = (r) =>
  require.ensure([], () => r(require('@/views/Return/ReturnBillsList/CheckItem')), 'Return');
const CreatPlan = (r) =>
  require.ensure([], () => r(require('@/views/Return/ReturnBillsList/CreatPlan')), 'Return');
const ReturnBillsItem = (r) =>
  require.ensure([], () => r(require('@/views/Return/ReturnBillsItem')), 'Return');

export default {
  path: '/Return',
  component: Layout,
  icon: 'fa fa-share',
  name: '退货管理',
  children: [
    {
      path: 'ReturnBillsList',
      component: ReturnBillsList,
      name: '退货单列表',
      meta: {
        functionName: '退货管理#退货单列表',
      },
      children: [
        {
          path: 'CheckItem',
          component: CheckItem,
          name: '退货单查看详情',
          meta: {
            functionName: '退货管理#退货单列表',
          },
        },
        {
          path: 'CreatPlan',
          component: CreatPlan,
          name: '新增退货单',
          meta: {
            functionName: '退货管理#退货单列表',
          },
        },
      ],
    },
    {
      path: 'ReturnBillsItem',
      component: ReturnBillsItem,
      name: '退货单明细',
      meta: {
        functionName: '退货管理#退货单明细',
      },
    },
  ],
};
