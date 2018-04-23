const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const DrugsUp = (r) => require.ensure([], () => r(require('@/views/Drugs/DrugsUp')), 'Drugs');
const DrugsCode = (r) => require.ensure([], () => r(require('@/views/Drugs/DrugsCode')), 'Drugs');
const DrugsSuperviseCode = (r) =>
  require.ensure([], () => r(require('@/views/Drugs/DrugsSuperviseCode')), 'Drugs');
const DrugsReportsList = (r) =>
  require.ensure([], () => r(require('@/views/Drugs/DrugsReportsList')), 'Drugs');
const DrugsBatchNo = (r) =>
  require.ensure([], () => r(require('@/views/Drugs/DrugsBatchNo')), 'Drugs');

export default {
  path: '/Drugs',
  component: Layout,
  icon: 'fa fa-database',
  name: '药品管理',
  children: [
    {
      path: 'DrugsUp',
      component: DrugsUp,
      name: '药品上架管理',
      meta: {
        functionName: '药品管理#药品上架管理',
      },
    },
    {
      path: 'DrugsCode',
      component: DrugsCode,
      name: '药品编码对照',
      meta: {
        functionName: '药品管理#药品编码对照',
      },
    },
    {
      path: 'DrugsSuperviseCode',
      component: DrugsSuperviseCode,
      name: '药品卫监码对照',
      meta: {
        functionName: '药品管理#药品卫监码对照',
      },
    },
    {
      path: 'DrugsReportsList',
      component: DrugsReportsList,
      name: '药检报告列表',
      meta: {
        functionName: '药品管理#药检报告列表',
      },
    },
    {
      path: 'DrugsBatchNo',
      component: DrugsBatchNo,
      name: '药品批号管理',
      meta: {
        functionName: '药品管理#药品批号管理',
      },
    },
  ],
};
