const Print = (r) => require.ensure([], () => r(require('@/views/Basic/Prints')), 'init');

const DelivePrint = (r) =>
  require.ensure([], () => r(require('@/views/Basic/Prints/DelivePrint')), 'DelivePrint');
const BarcodePrint = (r) =>
  require.ensure([], () => r(require('@/views/Basic/Prints/BarcodePrint')), 'BarcodePrint');
const InvoicePrint = (r) =>
  require.ensure([], () => r(require('@/views/Basic/Prints/InvoicePrint')), 'InvoicePrint');
const OrderDelivePrint = (r) =>
  require.ensure([], () => r(require('@/views/Basic/Prints/OrderDelivePrint')), 'OrderDelivePrint');

const DrugsPrint = (r) =>
  require.ensure([], () => r(require('@/views/Drugs/DrugsReportsList/PrintPreviewHtml')), 'Drugs');

export default {
  path: '/Print',
  name: '空主页',
  component: Print,
  children: [
    {
      path: 'DelivePrint',
      component: DelivePrint,
      name: '打印配送单',
    },
    {
      path: 'BarcodePrint',
      component: BarcodePrint,
      name: '批量条形码打印',
    },
    {
      path: 'InvoicePrint',
      component: InvoicePrint,
      name: '打印发票',
    },
    {
      path: 'DrugsPrint',
      component: DrugsPrint,
      name: '药检报告打印',
    },
    {
      path: 'OrderDelivePrint',
      component: OrderDelivePrint,
      name: '订单(配送企业)详情打印',
    },
  ],
};
