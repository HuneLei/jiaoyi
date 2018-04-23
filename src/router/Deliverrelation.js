const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const home = (r) => require.ensure([], () => r(require('@/views/Deliverrelation')), 'init');

const ProducerChoseDelivery = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverrelation/ProducerChoseDelivery')),
    'Deliverrelation',
  );
const ProducerContinueChoseDelivery = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverrelation/ProducerContinueChoseDelivery')),
    'Deliverrelation',
  );
const Create = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverrelation/ProducerContinueChoseDelivery/Create')),
    'Deliverrelation',
  ); // 卖方补充配送新增
const Edit = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverrelation/ProducerContinueChoseDelivery/Edit')),
    'Deliverrelation',
  ); // 卖方补充配送详情
const ProducerContinueChoseDeliveryItem = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverrelation/ProducerContinueChoseDeliveryItem')),
    'Deliverrelation',
  ); // 卖方补充配送明细
const DeliveryAffirm = (r) =>
  require.ensure([], () => r(require('@/views/Deliverrelation/DeliveryAffirm')), 'Deliverrelation');
const HospitalChoseDelivery = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverrelation/HospitalChoseDelivery')),
    'Deliverrelation',
  );
const HospitalChangeDelivery = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverrelation/HospitalChangeDelivery')),
    'Deliverrelation',
  );
const Create1 = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverrelation/HospitalChangeDelivery/Create')),
    'Deliverrelation',
  ); // 卖方补充配送新增
const Edit1 = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverrelation/HospitalChangeDelivery/Edit')),
    'Deliverrelation',
  ); // 卖方补充配送详情
const DrugsUsable = (r) =>
  require.ensure([], () => r(require('@/views/Deliverrelation/DrugsUsable')), 'Deliverrelation');
const DrugsUsablePrice = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverrelation/DrugsUsablePrice')),
    'Deliverrelation',
  );
const ChooseDeliver = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Deliverrelation/ProducerChoseDelivery/ChooseDeliver')),
    'Deliverrelation',
  );

export default {
  path: '/Deliverrelation',
  component: Layout,
  icon: 'fa fa-database',
  name: '配送关系管理',
  children: [
    {
      path: 'ProducerChoseDelivery',
      component: ProducerChoseDelivery,
      name: '卖方选配送',
      meta: {
        functionName: '配送关系管理#卖方选配送',
      },
    },
    {
      path: 'ProducerChoseDelivery/ChooseDeliver',
      component: ChooseDeliver,
      name: '卖方选配送-选择配送企业',
      meta: {
        functionName: '配送关系管理#卖方选配送',
      },
    },
    {
      path: 'ProducerContinueChoseDelivery',
      component: ProducerContinueChoseDelivery,
      name: '卖方补充配送',
      meta: {
        functionName: '配送关系管理#卖方补充配送',
      },
    },
    {
      path: 'ProducerContinueChoseDelivery/Create',
      component: Create,
      name: '卖方补充配送-新增',
      meta: {
        functionName: '配送关系管理#卖方补充配送',
      },
    },
    {
      path: 'ProducerContinueChoseDelivery/Edit',
      component: Edit,
      name: '卖方补充配送-详情',
      meta: {
        functionName: '配送关系管理#卖方补充配送',
      },
    },
    {
      path: 'ProducerContinueChoseDeliveryItem',
      component: ProducerContinueChoseDeliveryItem,
      name: '卖方补充配送明细',
      meta: {
        functionName: '配送关系管理#卖方补充配送明细',
      },
    },
    {
      path: 'DeliveryAffirm',
      component: DeliveryAffirm,
      name: '配送企业确认',
      meta: {
        functionName: '配送关系管理#配送企业确认',
      },
    },
    {
      path: 'HospitalChoseDelivery',
      component: HospitalChoseDelivery,
      name: '买方选配送',
      meta: {
        functionName: '配送关系管理#买方选配送',
      },
    },
    {
      path: 'HospitalChangeDelivery',
      component: HospitalChangeDelivery,
      name: '买方更换配送',
      meta: {
        functionName: '配送关系管理#买方更换配送',
      },
    },
    {
      path: 'HospitalChangeDelivery/Create',
      component: Create1,
      name: '买方更换配送-新增',
      meta: {
        functionName: '配送关系管理#买方更换配送',
      },
    },
    {
      path: 'HospitalChangeDelivery/Edit',
      component: Edit1,
      name: '买方更换配送-详情',
      meta: {
        functionName: '配送关系管理#买方更换配送',
      },
    },
    {
      path: 'DrugsUsable',
      component: DrugsUsable,
      name: '可采药品目录',
      meta: {
        functionName: '配送关系管理#可采药品目录',
      },
    },
    {
      path: 'DrugsUsablePrice',
      component: DrugsUsablePrice,
      name: '协议价维护',
      meta: {
        functionName: '配送关系管理#协议价维护',
      },
    },
  ],
};
