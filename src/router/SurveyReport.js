const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const DrugsHarmfulResponse = (r) =>
  require.ensure([], () => r(require('@/views/SurveyReport/DrugsHarmfulResponse')), 'SurveyReport');
const CreateReport = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/SurveyReport/DrugsHarmfulResponse/Create')),
    'SurveyReport',
  );
const EditReport = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/SurveyReport/DrugsHarmfulResponse/Edit')),
    'SurveyReport',
  );
const HarmfulResponseTest = (r) =>
  require.ensure([], () => r(require('@/views/SurveyReport/HarmfulResponseTest')), 'SurveyReport');
const Create = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/SurveyReport/HarmfulResponseTest/Create')),
    'SurveyReport',
  );
const Edit = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/SurveyReport/HarmfulResponseTest/Edit')),
    'SurveyReport',
  );

export default {
  path: '/SurveyReport',
  component: Layout,
  icon: 'fa fa-question-circle',
  name: '调查报告',
  children: [
    {
      path: 'DrugsHarmfulResponse',
      component: DrugsHarmfulResponse,
      name: '药品不良反应报告表',
      meta: {
        functionName: '调查报告#药品不良反应报告表',
      },
    },
    {
      path: 'DrugsHarmfulResponse/Create',
      component: CreateReport,
      name: '药品不良反应报告表新增',
      meta: {
        functionName: '调查报告#药品不良反应报告表',
      },
    },
    {
      path: 'DrugsHarmfulResponse/Edit',
      component: EditReport,
      name: '药品不良反应报告表编辑',
      meta: {
        functionName: '调查报告#药品不良反应报告表',
      },
    },
    {
      path: 'HarmfulResponseTest',
      component: HarmfulResponseTest,
      name: '不良反应监测调查表',
      meta: {
        functionName: '调查报告#不良反应监测调查表',
      },
    },
    {
      path: 'HarmfulResponseTest/Create',
      component: Create,
      name: '不良反应监测调查表新增',
      meta: {
        functionName: '调查报告#不良反应监测调查表',
      },
    },
    {
      path: 'HarmfulResponseTest/Edit',
      component: Edit,
      name: '不良反应监测调查表编辑',
      meta: {
        functionName: '调查报告#不良反应监测调查表',
      },
    },
  ],
};
