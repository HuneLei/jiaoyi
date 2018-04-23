const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const MonthlySales = (r) =>
  require.ensure([], () => r(require('@/views/General/MonthlySales')), 'General');
const MonthlyCollect = (r) =>
  require.ensure([], () => r(require('@/views/General/MonthlyCollect')), 'General');
const HospitalRegulations = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverrelation/HospitalRegulations')),
    'Deliverrelation',
  ); //  医院品规报表
const ComponentAnalysis = (r) =>
  require.ensure([], () => r(require('@/views/General/ComponentAnalysis')), 'General'); //  构成分析（交易平台）
const PurchaseAnalysis = (r) =>
  require.ensure([], () => r(require('@/views/General/PurchaseAnalysis')), 'General'); //  医院采购分析
const DeliveryStock = (r) =>
  require.ensure([], () => r(require('@/views/General/DeliveryStock')), 'General'); //  配送商库存分析

export default {
  path: '/General',
  component: Layout,
  icon: 'fa fa-database',
  name: '通用报表',
  children: [
    {
      path: 'HospitalRegulations',
      component: HospitalRegulations,
      name: '医院品规报表',
      meta: {
        functionName: '通用报表#医院品规报表',
      },
    },
    {
      path: 'MonthlySales',
      component: MonthlySales,
      name: '月度销售报表',
      meta: {
        functionName: '通用报表#月度销售报表',
      },
    },
    {
      path: 'MonthlyCollect',
      component: MonthlyCollect,
      name: '月度汇总报表',
      meta: {
        functionName: '通用报表#月度汇总报表',
      },
    },
    {
      path: 'ComponentAnalysis',
      component: ComponentAnalysis,
      name: '构成分析',
      meta: {
        functionName: '通用报表#构成分析',
      },
    },
    {
      path: 'PurchaseAnalysis',
      component: PurchaseAnalysis,
      name: '医院采购分析',
      meta: {
        functionName: '通用报表#医院采购分析',
      },
    },
    {
      path: 'DeliveryStock',
      component: DeliveryStock,
      name: '配送商库存分析',
      meta: {
        functionName: '通用报表#配送企业库存分析',
      },
    },
  ],
};
