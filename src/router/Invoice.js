const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const InvoiceList = (r) =>
  require.ensure([], () => r(require('@/views/Invoice/InvoiceList')), 'Invoice');
const Edit = (r) =>
  require.ensure([], () => r(require('@/views/Invoice/InvoiceList/Edit')), 'Invoice');
const Creat = (r) =>
  require.ensure([], () => r(require('@/views/Invoice/InvoiceList/Creat')), 'Invoice');

const InvoiceItem = (r) =>
  require.ensure([], () => r(require('@/views/Invoice/InvoiceItem')), 'Invoice');
const InvoiceGather = (r) =>
  require.ensure([], () => r(require('@/views/Invoice/InvoiceGather')), 'Invoice');
const InvoiceQuery = (r) =>
  require.ensure([], () => r(require('@/views/Invoice/InvoiceQuery')), 'Invoice');

export default {
  path: '/Invoice',
  component: Layout,
  icon: 'fa fa-database',
  name: '发票管理',
  children: [
    {
      path: 'InvoiceList',
      component: InvoiceList,
      name: '发票列表',
      meta: {
        functionName: '发票管理#发票列表',
      },
      children: [
        {
          path: 'Edit',
          component: Edit,
          name: '发票列表-详情编辑',
          meta: {
            functionName: '发票管理#发票列表',
          },
        },
        {
          path: 'Creat',
          component: Creat,
          name: '发票列表-新增',
          meta: {
            functionName: '发票管理#发票列表',
          },
        },
      ],
    },
    {
      path: 'InvoiceItem',
      component: InvoiceItem,
      name: '发票明细',
      meta: {
        functionName: '发票管理#发票明细',
      },
    },
    {
      path: 'InvoiceGather',
      component: InvoiceGather,
      name: '发票汇总',
      meta: {
        functionName: '发票管理#发票汇总',
      },
    },
    {
      path: 'InvoiceQuery',
      component: InvoiceQuery,
      name: '发票查询',
      meta: {
        functionName: '发票管理#发票查询',
      },
    },
  ],
};
