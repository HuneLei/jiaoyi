const Layout = (r) => require.ensure([], () => r(require('@/views/Basic/Layout')), 'init');

const TriContractList = (r) =>
  require.ensure([], () => r(require('@/views/Contract/TriContractList')), 'Contract'); // 三方合同列表
const CreateContract = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Contract/TriContractList/CreateContract')),
    'Contract',
  ); // 三方合同列表
const UpdateContract = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Contract/TriContractList/UpdateContract')),
    'Contract',
  ); // 三方合同列表
const ApplyThreeContract = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Contract/TriContractList/ApplyThreeContract')),
    'Contract',
  ); // 三方合同列表
const CopyContract = (r) =>
  require.ensure([], () => r(require('@/views/Contract/TriContractList/CopyContract')), 'Contract'); // 三方合同列表

const ContractClose = (r) =>
  require.ensure([], () => r(require('@/views/Contract/ContractClose')), 'Contract'); // 合同结案申请单
const HonestContract = (r) =>
  require.ensure([], () => r(require('@/views/Contract/HonestContract')), 'Contract'); // 廉洁合同
const HonestContractDialog = (r) =>
  require.ensure(
    [],
    () => r(require('@/views/Contract/HonestContract/HonestContractDialog')),
    'Contract',
  ); // 廉洁合同
const UpdateContract1 = (r) =>
  require.ensure([], () => r(require('@/views/Contract/ContractClose/UpdateContract')), 'Contract'); // 合同结案申请单详情
const ContractItem = (r) =>
  require.ensure([], () => r(require('@/views/Contract/ContractItem')), 'Contract'); // 合同明细
const applyCloseList = (r) =>
  require.ensure([], () => r(require('@/views/Contract/ContractItem/applyCloseList')), 'Contract'); // 合同结案申请列表
const ContractDrugsSum = (r) =>
  require.ensure([], () => r(require('@/views/Contract/ContractDrugsSum')), 'Contract'); // 合同药品统计

export default {
  path: '/Contract',
  component: Layout,
  icon: 'fa fa-database',
  name: '合同管理',
  children: [
    {
      path: 'TriContractList',
      component: TriContractList,
      name: '三方合同列表',
      meta: {
        functionName: '合同管理#三方合同列表',
      },
    },
    {
      path: 'TriContractList/CreateContract',
      component: CreateContract,
      name: '三方合同列表-新增',
      meta: {
        functionName: '合同管理#三方合同列表',
      },
    },
    {
      path: 'TriContractList/UpdateContract',
      component: UpdateContract,
      name: '三方合同列表-编辑',
      meta: {
        functionName: '合同管理#三方合同列表',
      },
    },
    {
      path: 'TriContractList/ApplyThreeContract',
      component: ApplyThreeContract,
      name: '已发起三方合同列表',
      meta: {
        functionName: '合同管理#三方合同列表',
      },
    },
    {
      path: 'TriContractList/CopyContract',
      component: CopyContract,
      name: '三方合同列表复制',
      meta: {
        functionName: '合同管理#三方合同列表',
      },
    },
    {
      path: 'HonestContract',
      component: HonestContract,
      name: '廉洁合同列表',
      meta: {
        functionName: '合同管理#廉洁合同列表',
      },
    },
    {
      path: 'HonestContract/HonestContractDialog',
      component: HonestContractDialog,
      name: '廉洁合同详情',
      meta: {
        functionName: '合同管理#廉洁合同列表',
      },
    },
    {
      path: 'ContractClose',
      component: ContractClose,
      name: '合同结案申请单',
      meta: {
        functionName: '合同管理#合同结案申请单',
      },
    },
    {
      path: 'ContractClose/UpdateContract',
      component: UpdateContract1,
      name: '合同结案申请单详情',
      meta: {
        functionName: '合同管理#合同结案申请单',
      },
    },
    {
      path: 'ContractItem',
      component: ContractItem,
      name: '合同明细',
      meta: {
        functionName: '合同管理#合同明细',
      },
    },
    {
      path: 'ContractItem/applyCloseList',
      component: applyCloseList,
      name: '合同明细-合同结案申请表',
      meta: {
        functionName: '合同管理#合同明细',
      },
    },
    {
      path: 'ContractDrugsSum',
      component: ContractDrugsSum,
      name: '合同药品统计',
      meta: {
        functionName: '合同管理#合同药品统计',
      },
    },
  ],
};
