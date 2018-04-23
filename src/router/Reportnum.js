const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const HospitalReportNum = (r) =>
  require.ensure([], () => r(require('@/views/Reportnum/HospitalReportNum')), 'Reportnum');
const Edit = (r) =>
  require.ensure([], () => r(require('@/views/Reportnum/HospitalReportNum/Edit')), 'Reportnum');
const Creat = (r) =>
  require.ensure([], () => r(require('@/views/Reportnum/HospitalReportNum/Creat')), 'Reportnum');

const ReportNumSets = (r) =>
  require.ensure([], () => r(require('@/views/Reportnum/ReportNumSets')), 'Reportnum');
const ReportNumSum = (r) =>
  require.ensure([], () => r(require('@/views/Reportnum/ReportNumSum')), 'Reportnum');
const ReportNumList = (r) =>
  require.ensure([], () => r(require('@/views/Reportnum/ReportNumList')), 'Reportnum');

export default {
  path: '/Reportnum',
  component: Layout,
  icon: 'fa fa-database',
  name: '医疗机构报量管理',
  children: [
    {
      path: 'ReportNumSets',
      component: ReportNumSets,
      name: '报量期间设置',
      meta: {
        functionName: '医疗机构报量管理#报量期间设置',
      },
    },
    {
      path: 'HospitalReportNum',
      component: HospitalReportNum,
      name: '医疗机构报量',
      meta: {
        functionName: '医疗机构报量管理#医疗机构报量',
      },
      children: [
        {
          path: 'Edit',
          component: Edit,
          name: '医疗机构报量-详情',
          meta: {
            functionName: '医疗机构报量管理#医疗机构报量',
          },
        },
        {
          path: 'Creat',
          component: Creat,
          name: '医疗机构报量-新增',
          meta: {
            functionName: '医疗机构报量管理#医疗机构报量',
          },
        },
      ],
    },
    {
      path: 'ReportNumList',
      component: ReportNumList,
      name: '报量清单',
      meta: {
        functionName: '医疗机构报量管理#报量清单',
      },
    },
    {
      path: 'ReportNumSum',
      component: ReportNumSum,
      name: '报量汇总',
      meta: {
        functionName: '医疗机构报量管理#报量汇总',
      },
    },
  ],
};
